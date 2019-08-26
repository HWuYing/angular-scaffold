/**
 * Created by NX on 2019/8/24.
 */
import { EventEmitter} from './index';

export const globTitleSize: number = 80;
export const globPackageSize: number = 10000 - globTitleSize;

export const EVENT = {
  LINK:0,
  DATA: 1,
  CLOSE: 2,
  ERROR: 3,
  END: 4
};

export class PackageUtil {
  static CURSOR_SIZE: number = 16;
  static UID_BYTE_SIZE: number = 8;
  static TYPE_BYTE_SIZE: number = 8;
  static PACKAGE_SIZE: number = 32;
  static packageSign(uid: string, cursor: number, buffer: Buffer) {
    const size = PackageUtil.UID_BYTE_SIZE + PackageUtil.CURSOR_SIZE;
    const title = Buffer.alloc(size);
    const _uid = Buffer.from(uid, 'utf-8');
    title.writeUInt8(_uid.length, 0);
    title.writeUInt16BE(cursor, 1);
    return Buffer.concat([title, _uid, buffer], size + _uid.length + buffer.length);
  }

  static packageSigout(buffer: Buffer): { uid: string, cursor: number, data: Buffer} {
    const size = PackageUtil.UID_BYTE_SIZE + PackageUtil.CURSOR_SIZE;
    const title_size = size + buffer.readUInt8(0);
    const uid = buffer.slice(size, title_size).toString('utf-8');
    const cursor = buffer.readUInt16BE(1);
    const _buffer = buffer.slice(title_size);
    return { uid, cursor, data: _buffer };
  }

  static eventPackage(type: number) {
    const title = Buffer.alloc(PackageUtil.TYPE_BYTE_SIZE);
    title.writeUInt8(type, 0);
    return title;
  }

  static unEventPackage(buffer: Buffer) {
    return buffer.readUInt8(0);
  }

  static isEventPackage(buffer: Buffer): boolean {
    return PackageUtil.TYPE_BYTE_SIZE === buffer.length;
  }
}

export class PackageSeparation extends EventEmitter {
  private mergeCursor: number = 0;
  private mergeCache: Buffer = Buffer.alloc(0);
  private splitCursor: number = 0;
  private splitCache: Buffer = Buffer.alloc(0);
  private splitList: any[] = [];
  private splitPageSize: number;
  private mergeAll: number = 0;
  private losePackageCount: number;
  private maxPackageCount: number;

  packing(type: number, uid: string, buffer: Buffer): Buffer {
    const size = PackageUtil.TYPE_BYTE_SIZE + PackageUtil.UID_BYTE_SIZE + PackageUtil.PACKAGE_SIZE;
    const title = Buffer.alloc(size);
    const _uid = Buffer.from(uid, 'utf-8');
    title.writeUInt8(type, 4);
    title.writeUInt8(_uid.length, 5);
    const _package = Buffer.concat([title, _uid, buffer], size + _uid.length + buffer.length);
    _package.writeUInt32BE(_package.length, 0);
    return _package;
  }

  unpacking(buffer: Buffer): { type: number, uid: string, buffer: Buffer, packageSize: number } {
    const size = PackageUtil.TYPE_BYTE_SIZE + PackageUtil.UID_BYTE_SIZE + PackageUtil.PACKAGE_SIZE;
    const packageSize = buffer.readUInt32BE(0);
    const type = buffer.readUInt8(4);
    const title_size = size + buffer.readUInt8(5);
    const uid = buffer.slice(size, title_size).toString('utf-8');
    const _buffer = buffer.slice(title_size);
    return { type, uid, buffer: _buffer, packageSize: packageSize };
  }

  mergePackage(type: number, uid: string, buffer: Buffer) {
    const mergeCache = this.mergeCache;
    const packageBuffer = this.packing(type, uid, buffer);
    this.mergeCache = Buffer.concat([mergeCache, packageBuffer], mergeCache.length + packageBuffer.length);
    this.mergeAll += buffer.length;
    while (this.mergeCache.length > globPackageSize) {
      const sendBuffer = this.mergeCache.slice(0, globPackageSize);
      console.log(sendBuffer.length);
      this.mergeCache = this.mergeCache.slice(globPackageSize);
      this.send(uid, sendBuffer);
    }

    return packageBuffer;
  }

  splitPackage(buffer: Buffer) {
    const { cursor, data, uid } =  PackageUtil.packageSigout(buffer);
    const isEvent = PackageUtil.isEventPackage(data);
    const splitList = this.splitList;
    const size = PackageUtil.TYPE_BYTE_SIZE + PackageUtil.UID_BYTE_SIZE + PackageUtil.PACKAGE_SIZE;
    const type = isEvent ? PackageUtil.unEventPackage(data) : void(0);
    splitList[cursor] = !isEvent ? data : this.packing(type, uid, Buffer.alloc(0));
    while (splitList[this.splitCursor]) {
      const splitCache = this.splitCache;
      const packageBuffer = splitList[this.splitCursor];
      this.splitCache = Buffer.concat([splitCache, packageBuffer], splitCache.length + packageBuffer.length);

      if (!this.splitPageSize && this.splitCache.length >= size) {
        this.splitPageSize = this.unpacking(this.splitCache).packageSize;
      }
      while (this.splitPageSize && this.splitPageSize <= this.splitCache.length) {
        const packageData = this.splitCache.slice(0, this.splitPageSize);
        const { uid, type: packageType, buffer } = this.unpacking(packageData);
        this.splitCache = this.splitCache.slice(this.splitPageSize);
        this.emitSync('separation', {  uid, type: packageType, data: buffer });
        this.splitPageSize = void(0);
        if (this.splitCache.length >= size) {
          this.splitPageSize = this.unpacking(this.splitCache).packageSize;
        }
      }
      this.splitList[this.splitCursor] = void(0);
      this.splitCursor++;
    }
    this.printLoseInfo(uid, cursor, type);
  }

  send(uid: string, buffer: Buffer) {
    if (buffer.length !== 0) {
      const sendPackage = PackageUtil.packageSign(uid, this.mergeCursor, buffer);
      this.emitSync('send', sendPackage);
      this.mergeCursor++;
    }
  }

  eventPackage(uid: string, type: number) {
    console.log(type);
    this.immediatelySend(uid);
    this.send(uid, PackageUtil.eventPackage(type));
    this.mergeCache = Buffer.alloc(0);
  }

  printLoseInfo(uid: string, cursor: number, type?: number) {
    if (type === 4 || this.maxPackageCount) {
      if (type === 4) {
        const length = this.splitList.filter((item) => !!item).length;
        this.maxPackageCount = cursor;
        this.losePackageCount =  this.maxPackageCount - this.splitCursor - length + 1;
      } else {
        this.losePackageCount--;
      }
    }

    if (this.maxPackageCount && this.splitCursor  !== this.maxPackageCount) {
      console.log(`----------------${uid}-----------------`);
      console.log('maxPackageCount', cursor);
      console.log('splitCursor', this.splitCursor > 0 ? this.splitCursor - 1 : 0);
      console.log('losePackage', this.losePackageCount);
    }
  }

  immediatelySend(uid: string) {
    this.send(uid, this.mergeCache);
    this.mergeCache = Buffer.alloc(0);
  }
}

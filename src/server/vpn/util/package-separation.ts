/**
 * Created by NX on 2019/8/24.
 */
import { BufferUtil, EventEmitter, isArray} from './index';

export const globTitleSize: number = 80;
export const globPackageSize: number = 10000 - globTitleSize;

export class PackageUtil {
  static CURSOR_SIZE: number = 16;
  static UID_BYTE_SIZE: number = 8;
  static TYPE_BYTE_SIZE: number = 8;
  static PACKAGE_SIZE: number = 32;
  static packageSign(uid: string, cursor: number, buffer: Buffer) {
    const size = PackageUtil.UID_BYTE_SIZE + PackageUtil.CURSOR_SIZE;
    const title = Buffer.alloc(size);
    const _uid = Buffer.from(uid, 'utf-8');
    console.log(_uid.length);
    title.writeUInt8(_uid.length, 0);
    title.writeUInt16BE(cursor, 8);
    return Buffer.concat([title, _uid, buffer], size + _uid.length + buffer.length);
  }

  static packageSigout(buffer): { uid: string, cursor: number, buffer: Buffer} {
    const size = PackageUtil.UID_BYTE_SIZE + PackageUtil.CURSOR_SIZE;
    const title_size = size + buffer.readUInt8(0);
    const uid = buffer.slice(size, title_size).toString('utf-8');
    const cursor = buffer.readUInt16BE(8);
    const _buffer = buffer.slice(title_size);
    return { uid, cursor, buffer: _buffer };
  }
}


export class PackageSeparation extends EventEmitter {
  static getUid = (buffer: Buffer) => {
    const readByte = BufferUtil.readByte(buffer);
    return readByte(buffer.readUInt8(7), globTitleSize).toString('utf-8');
  };

  static unLinkTitle = (buffer: Buffer) => {
    const readByte = BufferUtil.readByte(buffer);
    const cursor = buffer.readUInt16BE(0);
    const packageSize = buffer.readUInt32BE(2);
    const type = buffer.readUInt8(6);
    const uid = readByte(buffer.readUInt8(7), globTitleSize).toString('utf-8');
    const data = readByte(buffer.readUInt16BE(8));
    return { cursor, uid, type, data, packageSize };
  };

  private cursor: number = 0;
  private mergeCursor: number = 0;
  private maxPackageCount: number;
  private losePackageCount: number = 0;
  private mergePackageList: Buffer[] = [];
  private packageAddCacheBuffer: Buffer = Buffer.alloc(0);

  private _mergeCursor: number = 0;
  private _mergeCache: Buffer = Buffer.alloc(0);
  private _splitCursor: number = 0;
  private _splitCache: Buffer = Buffer.alloc(0);
  private _splitList: any[] = [];
  private _splitPageSize: number;

  constructor() {
    super();
    // this.on('send1', (buffer: any) => {
    //   console.log(buffer);
    //   this.splitPackage(buffer);
    // });
    // this.on('separation1', ({ type, uid, data}: any) => {
    //   console.log(type, uid, data);
    // });
  }

  packing(type: number, uid: string, buffer: Buffer): Buffer {
    const size = PackageUtil.TYPE_BYTE_SIZE + PackageUtil.UID_BYTE_SIZE + PackageUtil.PACKAGE_SIZE;
    const title = Buffer.alloc(size);
    const _uid = Buffer.from(uid, 'utf-8');
    title.writeUInt8(type, 32);
    title.writeUInt8(_uid.length, 40);
    const _package = Buffer.concat([title, _uid, buffer], size + _uid.length + buffer.length);
    _package.writeUInt32BE(_package.length, 0);
    return _package;
  }

  unpacking(buffer: Buffer): { type: number, uid: string, buffer: Buffer, packageSize: number } {
    const size = PackageUtil.TYPE_BYTE_SIZE + PackageUtil.UID_BYTE_SIZE + PackageUtil.PACKAGE_SIZE;
    const title_size = size + buffer.readUInt8(40);
    const packageSize = buffer.readUInt32BE(0);
    const type = buffer.readUInt8(32);
    const uid = buffer.slice(size, title_size).toString('utf-8');
    const _buffer = buffer.slice(title_size);
    return { type, uid, buffer: _buffer, packageSize: packageSize };
  }

  mergePackage(type: number, uid: string, buffer: Buffer) {
    const mergeCache = this._mergeCache;
    const packageBuffer = this.packing(type, uid, buffer);
    this._mergeCache = Buffer.concat([mergeCache, packageBuffer], mergeCache.length + packageBuffer.length);
    if (this._mergeCache.length < globPackageSize) {
      return packageBuffer;
    }
    const sendBuffer = this._mergeCache.slice(0, globPackageSize);
    this._mergeCache = this._mergeCache.slice(globPackageSize);
    this.togger(uid, sendBuffer);

    return packageBuffer;
  }

  splitPackage(buffer: Buffer) {
    const { cursor, buffer: packageBuffer } = PackageUtil.packageSigout(buffer);
    const splitList = this._splitList;
    splitList[cursor] = packageBuffer;

    while (splitList[this._mergeCursor]) {
      const splitCache = this._splitCache;
      this._splitCache = Buffer.concat([splitCache, packageBuffer], splitCache.length + packageBuffer.length);
      if (!this._splitPageSize) {
        this._splitPageSize = this.unpacking(this._splitCache).packageSize;
      }

      if (this._splitPageSize <= this._splitCache.length) {
        const { uid, type, buffer } = this.unpacking(this._splitCache);
        this._splitPageSize = void(0);
        this.emitSync('separation1', {  uid, type, data: buffer});
      }

      this._mergeCursor++;
    }
    console.log(cursor, buffer);
  }

  togger(uid, buffer: Buffer) {
    const sendPackage = PackageUtil.packageSign(uid, this._mergeCursor, buffer);
    this.emitSync('send1', sendPackage);
    this._mergeCursor++;
  }

  linkTitle(type: number, uid: string, buffer: Buffer | Buffer[]): Buffer[] {
    if (isArray(buffer)) {
      return (buffer as Buffer[]).reduce((arr: Buffer[], item: Buffer) =>
        arr.concat(this.linkTitle(type, uid, item))
      , []);
    }

    if (buffer.length > globPackageSize) {
      return this.linkTitle(type, uid, [buffer.slice(0, globPackageSize), buffer.slice(globPackageSize)]);
    }
    const buf = Buffer.alloc(globTitleSize);
    const writeByte = BufferUtil.writeByte(buf);
    const packageBuffer = writeByte([uid, buffer], globTitleSize);
    packageBuffer.writeUInt16BE(this.cursor, 0);
    packageBuffer.writeUInt32BE(packageBuffer.length, 2);
    packageBuffer.writeUInt8(type, 6);
    packageBuffer.writeUInt8(uid.length, 7);
    packageBuffer.writeUInt16BE(buffer.length, 8);
    this.addPackage(packageBuffer);
    this.cursor++;
    // this.mergePackage(type, uid, buffer);
    return [packageBuffer];
  }

  printLoseInfo(type, uid, cursor) {
    if (type === 4 || this.maxPackageCount) {
      if (type === 4) {
        this.maxPackageCount = cursor;
      }
      const length = this.mergePackageList.filter((item) => !!item).length;
      this.losePackageCount =  this.maxPackageCount - this.mergeCursor - length + 1;
    }

    if (this.maxPackageCount && this.mergeCursor - 1  !== this.maxPackageCount) {
      console.log(`----------------${uid}-----------------`);
      console.log('maxPackageCount', cursor);
      console.log('mergeCount', this.mergeCursor - 1);
      console.log('losePackage', this.losePackageCount);
    }
  }

  unLinkTitle(buffer: Buffer) {
    const { cursor, uid, type, data, packageSize } = PackageSeparation.unLinkTitle(buffer);
    this.mergePackageList[cursor] = { cursor, uid, type, data, packageSize };

    while (this.mergePackageList[this.mergeCursor]) {
      this.emitSync('separation', this.mergePackageList[this.mergeCursor]);
      this.mergePackageList[this.mergeCursor] = void(0);
      this.mergeCursor++;
    }
    this.printLoseInfo(type, uid, cursor);
  }

  addPackage(packageBuffer: Buffer) {
    const writeByte = BufferUtil.writeByte(this.packageAddCacheBuffer);
    this.packageAddCacheBuffer = writeByte(packageBuffer, this.packageAddCacheBuffer.length);
    this.trigger();
    return packageBuffer;
  }

  trigger() {
    this.emitSync('send', this.packageAddCacheBuffer);
    this.packageAddCacheBuffer = Buffer.alloc(0);
  }

  immediatelySend(uid) {
  }
}

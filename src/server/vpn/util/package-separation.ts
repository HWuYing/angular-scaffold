/**
 * Created by NX on 2019/8/24.
 */
import { BufferUtil, EventEmitter, isArray} from './index';

export const globTitleSize: number = 80;
export const globPackageSize: number = 50000 - globTitleSize;

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
  private packageSeparationCacheBuffer:Buffer =  Buffer.alloc(0);

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
    this.cursor++;
    return [packageBuffer].map((item: buffer) => this.addPackage(item));
  }

  printLoseInfo(type, uid, cursor) {
    if (type === 4 || this.maxPackageCount) {
      if (type === 4) {
        this.maxPackageCount = cursor;
      }
      const length = this.mergePackageList.filter((item) => !!item).length;
      this.losePackageCount =  this.maxPackageCount - this.mergeCursor - length + 1;
    }

    if (this.maxPackageCount && this.mergeCursor !== this.maxPackageCount) {
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
    // this.emitSync('separation', { cursor, uid, type, data, packageSize });
    // const packageSeparationCacheBuffer = this.packageSeparationCacheBuffer;
    // const mergeBuffer = BufferUtil.writeByte(packageSeparationCacheBuffer)(buffer, packageSeparationCacheBuffer.length);
    // const { cursor, uid, type, data, packageSize } = PackageSeparation.unLinkTitle(mergeBuffer);
    // console.log('mergeCursor', this.mergeCursor);
    // console.log(uid);
    // if (mergeBuffer.length < packageSize) {
    //   return false;
    // }
    // this.packageSeparationCacheBuffer = mergeBuffer.slice(packageSize);
    // this.emitSync('separation', { cursor, uid, type, data, packageSize });
    // if (this.packageSeparationCacheBuffer.length) {
    //   this.unLinkTitle(Buffer.alloc(0));
    // }
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
    // const packageCacheSize = this.packageAddCacheBuffer.length;
    // const overflow = packageCacheSize - globPackageSize;
    // if (overflow < 0) {
    //   return ;
    // }
    // const sendPackage = this.packageAddCacheBuffer.slice(0, globPackageSize);
    // this.emitSync('send', sendPackage);
    // this.packageAddCacheBuffer = this.packageAddCacheBuffer.slice(globPackageSize);
    // return this.trigger();
  }

  immediatelySend(uid) {
    console.log(`===>${uid}`,this.packageAddCacheBuffer.length);
  }
}

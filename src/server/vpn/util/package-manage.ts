/**
 * Created by NX on 2019/8/24.
 */
import {PackageSeparation, PackageUtil, EVENT} from './package-separation';
import { ProxySocket} from "../net-util/proxy-socket";

export class PackageManage {
  protected cursor: number = 0;
  protected  isEnd: boolean = false;
  constructor(
    protected uid: string,
    protected packageSeparation: PackageSeparation,
    protected type?: string
  ) { }

  /**
   * socket end事件注册
   * @param uid
   */
  endCall = (sourceMap: Map<string, ProxySocket>) => () => {
    // console.log(`------${this.type} end listening ${this.uid}------`);
    if (!this.isEnd) {
      // this.packageSeparation.mergePackage(EVENT.END, uid, Buffer.alloc(0));
      // this.packageSeparation.immediatelySend(this.uid);
      this.packageSeparation.eventPackage(this.uid, EVENT.END);
    }
  };

  /**
   * socket close事件注册
   * @param uid
   */
  closeCall = (sourceMap: Map<string, ProxySocket>) => () => {
    // console.log(`------${this.type} close ${this.uid}------`);
    // this.packageSeparation.linkTitle(EVENT.CLOSE, uid, Buffer.alloc(0));
    sourceMap.delete(this.uid);
  };

  /**
   * socket error事件注册
   * @param uid
   */
  errorCall = () => () => {
    // console.log(`------${this.type} error ${this.uid}------`);
    if (!this.isEnd) {
      this.packageSeparation.packing(EVENT.ERROR, this.uid, Buffer.alloc(0));
    }
  };

  distributeCall = (proxySocket: ProxySocket, sourceMap: Map<string, ProxySocket>) => ({ uid, data, type }: any) => {
    // console.log(`================${this.type} ${['link', 'data', 'close', 'error', 'end'][type]} ${cursor} ${uid} ======================`);
    // console.log(data.toString());
    // console.log('========================================');
    switch (type) {
      case EVENT.LINK:
      case EVENT.DATA: proxySocket.write(data); break;
      case EVENT.END:
      case EVENT.ERROR: proxySocket.end(); break;
      case EVENT.CLOSE: break;
    }

    if (![EVENT.LINK, EVENT.DATA].includes(type)) {
      this.isEnd = true;
      console.log(`------${this.type} ${['link', 'data', 'close', 'error', 'end'][type]} ${uid}------`);
      sourceMap.delete(uid);
    }
  };
}

export class BrowserManage extends PackageManage{
  constructor(uid: string, packageSeparation: PackageSeparation) {
    super(uid, packageSeparation, 'browser');
  }

  browserLinkCall = () => (buffer: any) => {
    const event = this.cursor === 0 ? EVENT.LINK : EVENT.DATA;
    this.packageSeparation.mergePackage(event, this.uid, buffer);
    this.packageSeparation.immediatelySend(this.uid);
    this.cursor++;
  };

  /**
   * 连接代理服务器
   * @param packageSeparation
   */
  browserDataCall = () => (buffer: any) => {
    const { cursor, data, uid } = PackageUtil.packageSigout(buffer);
    // console.log(`---cn length: ${data.length}  cursor: ${cursor} uid: ${uid}---`);
    this.packageSeparation.splitPackage(buffer);
  };

  sendCall = (sendUdp: (buffer: Buffer) => void) => ( buffer: Buffer) => {
    sendUdp(buffer);
  }
}

export class ServerManage extends PackageManage{
  constructor(uid: string,packageSeparation: PackageSeparation) {
    super(uid, packageSeparation, 'server ');
  }

  serverLinkCall = () => (buffer: any) => {
    this.packageSeparation.mergePackage(EVENT.DATA, this.uid, buffer);
  };

  /**
   * 连接目标服务器事件
   * @param packageSeparation
   */
  serverDataCall = () => (buffer: any) => {
    this.packageSeparation.splitPackage(buffer);
  };

  sendCall = (sendUdp: (buffer: Buffer) => void) => ( buffer: Buffer) => {
    const { cursor, data, uid } = PackageUtil.packageSigout(buffer);
    // console.log(`---en length: ${data.length}  cursor: ${cursor} uid: ${uid}---`);
    sendUdp(buffer);
    // udpSocket.send(buffer, 6800, (error: Error) => {  });
  };
}

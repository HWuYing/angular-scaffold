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
  endCall = (sourceMap: Map) => () => {
    // console.log(`------${this.type} end listening ${this.uid}------`);
    if (!this.isEnd) {
      // this.packageSeparation.mergePackage(EVENT.END, uid, Buffer.alloc(0));
      // this.packageSeparation.immediatelySend(this.uid);
      this.packageSeparation.eventPackage(uid, EVENT.END);
    }
  };

  /**
   * socket close事件注册
   * @param uid
   */
  closeCall = (sourceMap: Map) => () => {
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
      this.packageSeparation.packing(EVENT.ERROR, uid, Buffer.alloc(0));
    }
  };

  distributeCall = (proxySocket: ProxySocket, sourceMap: Map) => ({ uid, data, type }: any) => {
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
      // console.log(`------${this.type} ${['link', 'data', 'close', 'error', 'end'][type]} ${uid}------`);
      sourceMap.delete(uid);
    }
  };

  sendCall = (proxySocket: ProxySocket) => ( buffer: Buffer) => {
    proxySocket.write(buffer);
  };
}

export class BrowserManage extends PackageManage{
  constructor(uid: string, packageSeparation: PackageSeparation) {
    super(uid, packageSeparation, 'browser');
  }

  browserLinkCall = () => (buffer: any) => {
    const event = this.cursor === 0 ? EVENT.LINK : EVENT.DATA;
    console.log('browserLinkCall', this.uid);
    this.packageSeparation.mergePackage(event, this.uid, buffer);
    this.packageSeparation.immediatelySend(this.uid);
    this.cursor++;
  };

  /**
   * 连接代理服务器
   * @param packageSeparation
   */
  browserDataCall = () => (buffer: any) => {
    this.packageSeparation.splitPackage(buffer);
  };

  sendCall = (sendUdp: (buffer: Buffer) => void) => ( buffer: Buffer) => {
    // const { data, uid, cursor, type } = PackageSeparation.unLinkTitle(buffer);
    // console.log(data.toString());
    // console.log('========================================');
    // if (this.cursor === 0) {
    //   console.log(`================browser send ${cursor} ${uid} ======================`);
    // }
    // if (cursor === 0) {
    //   console.log(`-------------client ${uid}------------------`);
    //   console.log(data.toString().match(/([^\n]+)/g)[0]);
    // }
    sendUdp(buffer);
  };
}

export class ServerManage extends PackageManage{
  constructor(uid: string,packageSeparation: PackageSeparation) {
    super(uid, packageSeparation, 'server ');
  }

  serverLinkCall = (proxySocket: ProxySocket) => (buffer: any) => {
    this.packageSeparation.mergePackage(EVENT.DATA, this.uid, buffer);
    if (this.cursor === 0) {
      this.packageSeparation.immediatelySend(this.uid);
    }
  };

  /**
   * 连接目标服务器事件
   * @param packageSeparation
   */
  serverDataCall = () => (buffer: any) => {
    this.packageSeparation.splitPackage(buffer);
  };

  sendCall = (sendUdp: (buffer: Buffer) => void) => ( buffer: Buffer) => {
    // const { cursor, type, uid, data } = PackageSeparation.unLinkTitle(buffer);
    // console.log(`================server send ${cursor} ${uid} ======================`);
    // console.log(data.toString());
    // console.log('========================================');
    // console.log(`--------------en  cursor:${cursor} type:${['link', 'data', 'close', 'error', 'end'][type]}  ${uid}--------------------------`);
    const { cursor, data, uid } = PackageUtil.packageSigout(buffer);
    sendUdp(buffer);
    // udpSocket.send(buffer, 6800, (error: Error) => {  });
  };
}

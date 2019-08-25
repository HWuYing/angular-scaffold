/**
 * Created by NX on 2019/8/24.
 */
import { PackageSeparation } from './package-separation';
import {ProxySocket} from "../net-util/proxy-socket";

export const EVENT = {
  LINK:0,
  DATA: 1,
  CLOSE: 2,
  ERROR: 3,
  END: 4
};

export class PackageManage {
  protected cursor: number = 0;
  constructor(
    protected uid: string,
    protected packageSeparation: PackageSeparation,
    protected type?: string
  ) { }

  /**
   * socket end事件注册
   * @param uid
   */
  endCall = () => () => {
    this.packageSeparation.immediatelySend(this.uid);
    // console.log(`------${this.type} end ${this.uid}------`);
    this.packageSeparation.linkTitle(EVENT.END, uid, Buffer.alloc(0));
  };

  /**
   * socket close事件注册
   * @param uid
   */
  closeCall = (sourceMap: Map) => () => {
    // console.log(`------${this.type} close ${this.uid}------`);
    // this.packageSeparation.linkTitle(EVENT.CLOSE, uid, Buffer.alloc(0));
  };

  /**
   * socket error事件注册
   * @param uid
   */
  errorCall = () => () => {
    // console.log(`------${this.type} error ${this.uid}------`);
    this.packageSeparation.linkTitle(EVENT.ERROR, uid, Buffer.alloc(0));
  };

  distributeCall = (proxySocket: ProxySocket, sourceMap: Map) => ({ uid, data, type, cursor }: any) => {
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
      // console.log(`------${this.type} ${['link', 'data', 'close', 'error', 'end'][type]} ${cursor} ${uid}------`);
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
    this.packageSeparation.linkTitle(event, this.uid, buffer);
    this.cursor++;
  };

  /**
   * 连接代理服务器
   * @param packageSeparation
   */
  browserDataCall = () => (buffer: any) => {
    this.packageSeparation.unLinkTitle(buffer);
  };

  sendCall = (sendUdp: (buffer: Buffer) => void) => ( buffer: Buffer) => {
    const { data, uid, cursor, type } = PackageSeparation.unLinkTitle(buffer);
    // console.log(data.toString());
    // console.log('========================================');
    // if (this.cursor === 0) {
    //   console.log(`================browser send ${cursor} ${uid} ======================`);
    // }
    if (cursor === 0) {
      console.log(`-------------client ${uid}------------------`);
      console.log(data.toString().match(/([^\n]+)/g)[0]);
    }
    sendUdp(buffer);
  };
}

export class ServerManage extends PackageManage{
  constructor(uid: string,packageSeparation: PackageSeparation) {
    super(uid, packageSeparation, 'server ');
  }

  serverLinkCall = (proxySocket: ProxySocket) => (buffer: any) => {
    this.packageSeparation.linkTitle(EVENT.DATA, this.uid, buffer);
  };

  /**
   * 连接目标服务器事件
   * @param packageSeparation
   */
  serverDataCall = () => (buffer: any) => {
    this.packageSeparation.unLinkTitle(buffer);
  };

  sendCall = (sendUdp: (buffer: Buffer) => void) => ( buffer: Buffer) => {
    const { cursor, type, uid, data } = PackageSeparation.unLinkTitle(buffer);
    // console.log(`================server send ${cursor} ${uid} ======================`);
    // console.log(data.toString());
    // console.log('========================================');
    // console.log(`--------------en  cursor:${cursor} type:${['link', 'data', 'close', 'error', 'end'][type]}  ${uid}--------------------------`);
    sendUdp(buffer);
    // udpSocket.send(buffer, 6800, (error: Error) => {  });
  };
}

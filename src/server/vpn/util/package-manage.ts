/**
 * Created by NX on 2019/8/24.
 */
import { Socket, createSocket } from 'dgram';
import { PackageSeparation } from './package-separation';
import {ProxySocket} from "../net-util/proxy-socket";

export const EVENT = {
  LINK:0,
  DATA: 1,
  CLOSE: 2,
  ERROR: 3,
  END: 4
};

const sendUdp = (() => {
  const udpList = new Array(10).fill('').map((item, index) => createSocket('udp4'));
  let cursor = 0;
  return (buffer: any, port: number) => {
    cursor++;
    if (cursor >= udpList.length) {
      cursor = 0;
    }
    udpList[cursor].send(buffer, port + cursor, (error: Error) => {
      if (error) {
        console.log(error);
      }
    });
  };
})();

export class PackageManage {
  protected cursor: number = 0;
  protected timeout: number = 5000;
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
    // this.packageSeparation.immediatelySend();
    console.log(`================${this.type} end ${this.uid} ======================`);
    this.packageSeparation.linkTitle(EVENT.END, uid, Buffer.alloc(0));
  };

  /**
   * socket close事件注册
   * @param uid
   */
  closeCall = (sourceMap: Map) => () => {
    console.log(`================${this.type} close ${this.uid} ======================`);
    // this.packageSeparation.linkTitle(EVENT.CLOSE, uid, Buffer.alloc(0));
  };

  /**
   * socket error事件注册
   * @param uid
   */
  errorCall = () => () => {
    console.log(`================${this.type} error ${this.uid} ======================`);
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
      console.log(`================${this.type} ${['link', 'data', 'close', 'error', 'end'][type]} ${cursor} ${uid} ======================`);
      // console.log(`============================== target ===============================================`);
      // console.log(`----------${['close', 'error', 'end'][type-2]} ${this.uid}-------------------`);
      sourceMap.delete(uid);
      // console.log('size===================================', sourceMap.size);
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
    console.log('event', event);
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
    if (this.cursor === 0) {
      console.log(`================browser send ${cursor} ${uid} ======================`);
    }
    sendUdp(buffer);
  };
}

export class ServerManage extends PackageManage{
  constructor(uid: string,packageSeparation: PackageSeparation) {
    super(uid, packageSeparation, 'server');
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

  sendCall = (udpSocket: Socket) => ( buffer: Buffer) => {
    const { cursor, type, uid, data } = PackageSeparation.unLinkTitle(buffer);
    // console.log(`================server send ${cursor} ${uid} ======================`);
    // console.log(data.toString());
    // console.log('========================================');
    // console.log(`--------------en  cursor:${cursor} type:${['link', 'data', 'close', 'error', 'end'][type]}  ${uid}--------------------------`);
    sendUdp(buffer, 6800);
    // udpSocket.send(buffer, 6800, (error: Error) => {  });
  };
}

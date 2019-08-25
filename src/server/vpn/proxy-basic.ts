/**
 * Created by NX on 2019/8/25.
 */
import { ProxyUdpServer, createUdpServer  } from './net-util/proxy-udp';
import { ProxyUdpSocket, createSocketClient } from './net-util/proxy-udp-socket';

export class ProxyBasic {
  protected socketMap: Map =  new Map();
  protected udpServerList: ProxyUdpServer[] = [];
  protected udpClientList: ProxyUdpSocket[] = [];
  constructor() { }

  protected createUdpSocket(port: number, count: number) {
    new Array(count).fill(port).map((item: number, index: number) => {
      this.udpServerList.push(createUdpServer(port + index));
      this.udpClientList.push(createSocketClient('127.0.0.1', 6900 + index));
    });
  }

  protected send() {
    let cursor: number = 0;
    return (data: buffer) => {
      if (cursor >= this.udpClientList.length) {
        cursor = 0;
      }
      this.udpClientList[cursor].write(data);
      cursor++;
    };
  }
}

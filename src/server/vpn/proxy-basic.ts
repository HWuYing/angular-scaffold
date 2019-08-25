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

  protected createUdpSocket(listeningPort: number, connectPort: number, count: number) {
    new Array(count).fill(listeningPort).map((item: number, index: number) => {
      this.udpServerList.push(createUdpServer(item + index));
      this.udpClientList.push(createSocketClient('127.0.0.1', connectPort + index));
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

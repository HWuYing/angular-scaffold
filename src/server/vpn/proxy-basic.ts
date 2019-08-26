/**
 * Created by NX on 2019/8/25.
 */
import { ProxyUdpServer, createUdpServer  } from './net-util/proxy-udp';
import { ProxyUdpSocket, createSocketClient } from './net-util/proxy-udp-socket';
import { ProxySocket } from './net-util';
import { buffer } from 'rxjs/operators';

export class ProxyBasic {
  protected socketMap: Map<string, ProxySocket> =  new Map();
  protected udpServerList: ProxyUdpServer[] = [];
  protected udpClientList: ProxyUdpSocket[] = [];
  protected addressList: { port: number, host: string }[] = [];
  private cacheBufferList: Buffer[] = [];
  constructor() { }

  protected createUdpSocket(listeningPort: number, connectPort: number, count: number) {
    new Array(count).fill(listeningPort).map((item: number, index: number) => {
      this.udpServerList.push(createUdpServer(item + index));
      this.udpClientList.push(createSocketClient('127.0.0.1', connectPort + index));
      this.addressList.push({ port: connectPort + index, host: '127.0.0.1' });
    });
  }

  protected send() {
    let cursor: number = 0;
    return (data: Buffer | Buffer[]) => {
      if (cursor >= this.addressList.length) {
        cursor = 0;
      }
      this.udpServerList[0].write(data, this.addressList[cursor].port, this.addressList[cursor].host);
      // this.udpClientList[cursor].write(data);
      cursor++;
    };
  }
}

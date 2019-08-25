import { ProxySocket } from './net-util';
import { ProxyEventEmitter } from './net-util/proxy-event-emitter';
import { ServerManage, EVENT } from './util/package-manage';
import { PackageSeparation } from './util/package-separation';
import { ProxyUdpServer  } from './net-util/proxy-udp';
import { ProxyBasic } from './proxy-basic';

class TcpConnection extends ProxyBasic{
  private socketMap: Set = new Map();
  private serverProxySocket: ProxyEventEmitter = new ProxyEventEmitter(null);

  constructor() {
    super();
    this.createUdpSocket(6900, 10);
  }

  protected createUdpSocket(port: number, count: number) {
    super.createUdpSocket(port, count);
    this.udpServerList.forEach((server: ProxyUdpServer) => {
      server.on('data', this.requestData());
    });
    this.serverProxySocket.on('link', this.connectionListener());
  }

  protected requestData = () => (data: buffer) => {
    const { type, uid, data: _data } = PackageSeparation.unLinkTitle(data);
    const clientSocket = this.socketMap.get(PackageSeparation.getUid(data));
    if (type === EVENT.LINK) {
      console.log(`-----------------------------server ${uid}---------------------------------------`);
      console.log(_data.toString().match(/([^\n]+)/g)[0]);
      console.log(_data.toString().match(/([^\n]+)/g)[1]);
    }
    type === EVENT.LINK ? this.serverProxySocket.emitSync('link', uid, data) : clientSocket.emitSync('link', data);
  };

  private connectionListener = () => (uid: string, data: Buffer) => {
    const packageSeparation = new PackageSeparation();
    const packageManage = new ServerManage(uid, packageSeparation);
    const clientProxySocket = ProxySocket.createSocketClient('127.0.0.1', 3001);
    this.socketMap.set(uid, clientProxySocket);

    packageSeparation.on('send', packageManage.sendCall(this.send()));
    packageSeparation.on('separation', packageManage.distributeCall(clientProxySocket, this.socketMap));
    clientProxySocket.on('link', packageManage.serverDataCall());
    clientProxySocket.on('end', packageManage.endCall());
    clientProxySocket.on('error', packageManage.errorCall());
    clientProxySocket.on('close', packageManage.closeCall(this.socketMap));
    clientProxySocket.on('connect', () => packageManage.serverDataCall()(data));
    clientProxySocket.on('data', packageManage.serverLinkCall());
  };
}

 new TcpConnection();

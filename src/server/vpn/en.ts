import { ProxySocket } from './net-util';
import { ProxyEventEmitter } from './net-util/proxy-event-emitter';
import { ServerManage } from './util/package-manage';
import { PackageSeparation, PackageUtil } from './util/package-separation';
import { ProxyUdpServer  } from './net-util/proxy-udp';
import { ProxyBasic } from './proxy-basic';

class TcpConnection extends ProxyBasic{
  private serverProxySocket: ProxyEventEmitter = new ProxyEventEmitter(null);

  constructor() {
    super('en');
    this.createUdpSocket(6900, 6800, 7);
  }

  protected createUdpSocket(port: number, connectPort: number, count: number) {
    super.createUdpSocket(port, connectPort, count);
    this.udpServerList.forEach((server: ProxyUdpServer) => {
      server.on('data', this.requestData());
    });
    this.serverProxySocket.on('link', this.connectionListener());
  }

  protected requestData = () => (buffer: Buffer) => {
    const { uid, data, cursor } = PackageUtil.packageSigout(buffer);
    const clientSocket = this.socketMap.get(uid);

    if (!clientSocket && cursor === 0) {
      this.serverProxySocket.emitSync('link', uid, buffer);
    } else if (clientSocket) {
      clientSocket.emitSync('link', buffer)
    }
  };

  private connectionListener = () => (uid: string, data: Buffer) => {
    const packageSeparation = new PackageSeparation();
    const packageManage = new ServerManage(uid, packageSeparation);
    // const clientProxySocket = ProxySocket.createSocketClient('127.0.0.1', 3001);
    const clientProxySocket = ProxySocket.createSocketClient('localhost', 4600);
    this.socketMap.set(uid, clientProxySocket);

    packageSeparation.on('send', packageManage.sendCall(this.send()));
    packageSeparation.on('separation', packageManage.distributeCall(clientProxySocket, this.socketMap));
    clientProxySocket.on('link', packageManage.serverDataCall());
    clientProxySocket.on('end', packageManage.endCall(this.socketMap));
    clientProxySocket.on('error', packageManage.errorCall());
    clientProxySocket.on('close', packageManage.closeCall(this.socketMap));
    clientProxySocket.on('connect', () => packageManage.serverDataCall()(data));
    clientProxySocket.on('data', packageManage.serverLinkCall());
  };
}

 new TcpConnection();

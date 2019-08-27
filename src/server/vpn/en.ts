import { ProxySocket, ProxyTcp } from './net-util';
import { ServerManage } from './util/package-manage';
import { PackageSeparation, PackageUtil } from './util/package-separation';
import { ProxyUdpServer  } from './net-util/proxy-udp';
import { ProxyBasic } from './proxy-basic';

class TcpConnection extends ProxyBasic {
  constructor() {
    super('en');
    this.createUdpSocket(6900, 6800, 7);
  }

  protected createUdpSocket(port: number, connectPort: number, count: number) {
    super.createUdpSocket(port, connectPort, count);
    this.udpServerList.forEach((server: ProxyUdpServer) => {
      server.on('data', this.requestData());
    });
  }

  private createTcpEvent(tcpEvent: ProxySocket) {
    tcpEvent.on('link', this.connectionListener());
    tcpEvent.on('data', (buffer: Buffer) => {
      const { uid } = PackageUtil.packageSigout(buffer);
      console.log(`--------server connection ${ uid }----------`);
      tcpEvent.emitSync('link', tcpEvent, uid, buffer);
    });
  }

  protected responseEvent = (tcpEvent: ProxySocket) => (buffer: Buffer[]) => {
    tcpEvent.write(buffer[0]);
  };

  protected requestData = () => (buffer: Buffer) => {
    const { uid } = PackageUtil.packageSigout(buffer);
    const clientSocket = this.socketMap.get(uid);
    if (clientSocket) {
      clientSocket.emitSync('link', buffer)
    } else {
      console.log('not ===> clientSocket');
    }
  };

  private connectionListener = () => (tcpEvent: ProxySocket, uid: string, data: Buffer) => {
    const packageSeparation = new PackageSeparation();
    const packageManage = new ServerManage(uid, packageSeparation, this.responseEvent(tcpEvent));
    // const clientProxySocket = ProxySocket.createSocketClient('127.0.0.1', 3001);
    const clientProxySocket = ProxySocket.createSocketClient('localhost', 4600);
    this.socketMap.set(uid, clientProxySocket);

    packageSeparation.on('send', packageManage.sendCall(this.send()));
    packageSeparation.on('separation', (data: Buffer, next) => {
      console.log('separation', data);
      next(data);
    });
    packageSeparation.on('separation', packageManage.distributeCall(clientProxySocket, this.socketMap));
    packageSeparation.on('event', this.responseEvent(tcpEvent));

    clientProxySocket.on('link', packageManage.serverDataCall());
    clientProxySocket.on('end', packageManage.endCall(this.socketMap));
    clientProxySocket.on('error', packageManage.errorCall());
    clientProxySocket.on('close', packageManage.closeCall(this.socketMap));
    clientProxySocket.on('connect', () => packageManage.serverDataCall()(data));
    clientProxySocket.on('data', packageManage.serverLinkCall());
  };

  call = () => (tcpEvent: ProxySocket) => this.createTcpEvent(tcpEvent);
}

ProxyTcp.createTcpServer(8000, new TcpConnection().call());

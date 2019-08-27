import { ProxySocket, ProxyTcp } from './net-util';
import { uuid } from './util';
import { BrowserManage } from './util/package-manage';
import { PackageSeparation, PackageUtil } from './util/package-separation';
import { ProxyUdpServer  } from './net-util/proxy-udp';
import { ProxyBasic } from './proxy-basic';

// console.log((process as any).getMasterWorkers());

class TcpConnection extends ProxyBasic{
  constructor() {
    super('cn');
    this.createUdpSocket(6800, 6900, 7);
  }

  protected createUdpSocket(port: number, connectPort: number, count: number) {
    super.createUdpSocket(port, connectPort, count);
    this.udpServerList.forEach((server: ProxyUdpServer) => {
      server.on('data', this.responseData());
    });
  }

  private createTcpEvent(uid: string, host: string, port: number) {
    const tcpEvent = ProxySocket.createSocketClient(host, port);
    tcpEvent.on('data', this.responseData());
    tcpEvent.on('error', (error: Error) => console.log(error));
    tcpEvent.on('connect', () => console.log('connect===>', `${uid} -- ${host}:${port}`));
    return tcpEvent;
  }

  protected requestEvent = (tcpEvent: ProxySocket) => (buffer: Buffer[]) => {
    console.log(buffer);
    const { uid } = PackageUtil.packageSigout(buffer[0]);
    console.log(`--------client connection ${ uid }----------`);
    console.log(buffer.length);
    tcpEvent.write(buffer[0]);
  };

  responseData = () => (buffer: Buffer) => {
    const { uid } = PackageUtil.packageSigout(buffer);
    const clientSocket = this.socketMap.get(uid);
    if (clientSocket) {
      clientSocket.emitSync('link', buffer);
    }
  };

  connectionListener(serverProxySocket: ProxySocket) {
    const uid = uuid();
    const tcpEvent = this.createTcpEvent(uid, '127.0.0.1', 8000);
    const packageSeparation = new PackageSeparation();
    const packageManage = new BrowserManage(uid, packageSeparation, this.requestEvent(tcpEvent));
    this.socketMap.set(uid, serverProxySocket);

    packageSeparation.on('send', packageManage.sendCall(this.send()));
    packageSeparation.on('separation', packageManage.distributeCall(serverProxySocket, this.socketMap));
    packageSeparation.on('event', this.requestEvent(tcpEvent));
    
    serverProxySocket.on('link', packageManage.browserDataCall());
    serverProxySocket.on('end', packageManage.endCall(this.socketMap));
    serverProxySocket.on('close', packageManage.closeCall(this.socketMap));
    serverProxySocket.on('error', packageManage.errorCall());
    serverProxySocket.on('data', packageManage.browserLinkCall());
  }

  call =  ()  => this.connectionListener.bind(this);
}

ProxyTcp.createTcpServer(80, new TcpConnection().call());

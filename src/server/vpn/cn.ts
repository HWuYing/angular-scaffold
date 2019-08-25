import { ProxySocket, ProxyTcp } from './net-util';
import { uuid } from './util';
import { BrowserManage } from './util/package-manage';
import { PackageSeparation } from './util/package-separation';
import { ProxyUdpServer  } from './net-util/proxy-udp';
import { ProxyBasic } from './proxy-basic';

class TcpConnection extends ProxyBasic{
  private socketMap: Map =  new Map();
  constructor() {
    super();
    this.createUdpSocket(6800, 10)
  }

  responseData = () => (data: Buffer) => {
    const clientSocket = this.socketMap.get(PackageSeparation.getUid(data));
    if (clientSocket) {
      clientSocket.emitSync('link', data);
    }
  };

  protected createUdpSocket(port: number, count: number) {
    super.createUdpSocket(port, count);
    this.udpServerList.forEach((server: ProxyUdpServer) => {
      server.on('data', this.responseData());
    });
  }

  connectionListener(serverProxySocket: ProxySocket) {
    const uid = uuid();
    const packageSeparation = new PackageSeparation();
    const packageManage = new BrowserManage(uid, packageSeparation);
    this.socketMap.set(uid, serverProxySocket);

    packageSeparation.on('send', packageManage.sendCall(this.send()));
    packageSeparation.on('separation', packageManage.distributeCall(serverProxySocket, this.socketMap));
    serverProxySocket.on('link', packageManage.browserDataCall());
    serverProxySocket.on('end', packageManage.endCall());
    serverProxySocket.on('close', packageManage.closeCall(this.socketMap));
    serverProxySocket.on('error', packageManage.errorCall());
    serverProxySocket.on('data', (data: any, next) => {
      console.log(`-----------------------------client ${uid}---------------------------------------`);
      console.log(data.toString().match(/([^\n]+)/g)[0]);
      console.log(data.toString().match(/([^\n]+)/g)[1]);
      next(data);
    });
    serverProxySocket.on('data', packageManage.browserLinkCall());
  }

  call =  ()  => this.connectionListener.bind(this);
}

ProxyTcp.createTcpServer(80, new TcpConnection().call());

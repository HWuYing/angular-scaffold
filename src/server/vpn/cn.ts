import { ProxySocket, ProxyTcp } from './net-util';
import { uuid } from './util';
import { BrowserManage } from './util/package-manage';
import { PackageSeparation, PackageUtil } from './util/package-separation';
import { ProxyUdpServer  } from './net-util/proxy-udp';
import { ProxyBasic } from './proxy-basic';

class TcpConnection extends ProxyBasic{
  constructor() {
    super();
    this.createUdpSocket(6800, 6900, 1);
  }

  responseData = () => (buffer: Buffer) => {
    const { uid, data, cursor } = PackageUtil.packageSigout(buffer);
    // console.log(`---------------accept browser-- ${cursor} ---- ${uid} -------------`);
    // console.log(`data:===>`, data.length);
    const clientSocket = this.socketMap.get(uid);
    if (clientSocket) {
      clientSocket.emitSync('link', buffer);
    }
  };

  protected createUdpSocket(port: number, connectPort: number, count: number) {
    super.createUdpSocket(port, connectPort, count);
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
    serverProxySocket.on('end', packageManage.endCall(this.socketMap));
    serverProxySocket.on('close', packageManage.closeCall(this.socketMap));
    serverProxySocket.on('error', packageManage.errorCall());
    serverProxySocket.on('data', (data: any, next) => {
      console.log(`-------------client ${uid}------------------`);
      console.log(data.toString().match(/([^\n]+)/g)[0]);
      console.log(data.toString().match(/([^\n]+)/g)[1]);
      next(data);
    });
    serverProxySocket.on('data', packageManage.browserLinkCall());
  }

  call =  ()  => this.connectionListener.bind(this);
}

ProxyTcp.createTcpServer(80, new TcpConnection().call());

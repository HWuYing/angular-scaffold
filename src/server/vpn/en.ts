import { ProxySocket } from './net-util';
import { ServerManage } from './util/package-manage';
import { PackageSeparation, PackageUtil } from './util/package-separation';
import { ProxyUdpServer  } from './net-util/proxy-udp';
import { ProxyBasic } from './proxy-basic';
import {ProxyTcp} from "./net-util/proxy-tcp";

class ServerProxy extends ProxyBasic {
  private tcpEventServer: ProxyTcp;
  constructor() {
    super('en');
    this.createUdpSocket(6900, 6800, 15);
    this.createTcpEventServer(8000);
  }

  protected createUdpSocket(port: number, connectPort: number, count: number) {
    super.createUdpSocket(port, connectPort, count);
    this.udpServerList.forEach((server: ProxyUdpServer) => {
      server.on('data', this.requestData());
    });
  }

  private createTcpEventServer(port: number) {
    let count = 0;
    ProxyTcp.createTcpServer(port, (proxySocket: ProxySocket) => {
      if (this.tcpEventServer) { }
      this.tcpEventServer = proxySocket;
      this.tcpEventServer.on('link', this.connectionListener());
      this.tcpEventServer.on('data', (buffer: Buffer) => {
        const { uid } = PackageUtil.packageSigout(buffer);
        console.log(`--------------server connection ${ uid }----------------`);
        this.tcpEventServer.emitSync('link', uid, buffer);
      });
    });
  }

  protected  responseEvent = () => (buffer: Buffer) => {

  };

  protected requestData = () => (buffer: Buffer) => {
    const { uid } = PackageUtil.packageSigout(buffer);
    const clientSocket = this.socketMap.get(uid);
    if (clientSocket) {
      clientSocket.emitSync('link', buffer)
    } else {

    }
  };

  private connectionListener = () => (uid: string, data: Buffer) => {
    const packageSeparation = new PackageSeparation();
    const packageManage = new ServerManage(uid, packageSeparation, this.responseEvent());
    // const clientProxySocket = ProxySocket.createSocketClient('127.0.0.1', 3001);
    const clientProxySocket = ProxySocket.createSocketClient('localhost', 3001);
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

new ServerProxy();

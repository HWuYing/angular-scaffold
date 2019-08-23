import { ProxySocket, ProxyTcp } from './net-util';
import { Handler } from './util';

const tcpServer = ProxyTcp.createTcpServer(80, (serverProxySocket: ProxySocket) => {
  const clientProxySocket = ProxySocket.createSocketClient('127.0.0.1', 6789);
  clientProxySocket.pipe(serverProxySocket);
  serverProxySocket.pipe(clientProxySocket);
  clientProxySocket.on('data', (data: Buffer, next: Handler) => {
    console.log('clientProxySocket', data);
    serverProxySocket.write(data);
  });

  // clientProxySocket.on('close', (data: Buffer, next: Handler) => {
  //   serverProxySocket.end();
  // });

  serverProxySocket.on('data', (data: Buffer, next: Handler) => {
    console.log('serverProxySocket', data);
    clientProxySocket.write(data);
  });

  // clientProxySocket.on('error', (error: Error, next: Handler) => {
  //   console.log('clientProxySocket', error);
  // });

  // serverProxySocket.on('error', (error: Error, next: Handler) => {
  //   console.log('serverProxySocket', error);
  // });

  // serverProxySocket.on('close', (data: Buffer, handler: Handler) => {
  //   clientProxySocket.end();
  // });
});


const tcpEnServer = ProxyTcp.createTcpServer(6789, (serverProxySocket: ProxySocket) => {
  const clientProxySocket = ProxySocket.createSocketClient('127.0.0.1', 4600);
  clientProxySocket.pipe(serverProxySocket);
  serverProxySocket.pipe(clientProxySocket);
});
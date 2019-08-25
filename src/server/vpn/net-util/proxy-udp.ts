/**
 * Created by NX on 2019/8/25.
 */
import { Socket, createSocket, RemoteInfo } from 'dgram';
import {ProxyEventEmitter} from "./proxy-event-emitter";

export const createUdpServer = (port: number): ProxyUdpServer => new ProxyUdpServer(port);

export class ProxyUdpServer extends ProxyEventEmitter {
  private udpServer: Socket = this.source as Socket;
  constructor(public port: bumber) {
    super(createSocket('udp4'), ['close']);
    this.onInit();
    this.listen(this.port);
    this.associatedListener(['error'], true);
  }

  private onInit() {
    this.udpServer.on('message', (msg: Buffer, rinfo: RemoteInfo) => {
      this.emitSync('data', msg, rinfo);
    });
    this.on('error', (error: Error) => this.socket.close());
  }

  listen(port: number) {
    this.udpServer.bind(port);
    this.udpServer.on('listening', () => {  });
  }
}

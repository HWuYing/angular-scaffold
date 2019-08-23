import { createConnection, Socket } from 'net';
import { ProxyEventEmitter } from './proxy-event-emitter';

export class ProxySocket extends ProxyEventEmitter {
  static pipeFns: string[] = ['destroy', 'address'];
  static createSocketClient = (host: string, port: number): ProxySocket => {
    return new ProxySocket(createConnection({ host, port }));
  }

  [x: string]: any;
  constructor(public socket: Socket) {
    super(socket, ProxySocket.pipeFns);
    this.onInit();
    this.associatedListener(['data', 'end', 'error', 'close']);
    this.associatedListener('connect', true);
  }

  private onInit() {
    this.on('connect', () => console.log('proxy-->sock','连接成功'));
  }

  write(data: Buffer) {
    this.socket.write(data);
    console.log(this.socket.destroyed);
  }

  end(data?: Buffer) {
    this.socket.end(data);
  }

  pipe(proxySocket: ProxySocket | Socket) {
    if (proxySocket instanceof ProxySocket) {
      this.socket.pipe(proxySocket.socket);
    } else {
      this.socket.pipe(proxySocket);
    }
  }
}

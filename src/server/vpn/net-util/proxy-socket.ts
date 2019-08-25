import { createConnection, Socket } from 'net';
import { ProxyEventEmitter } from './proxy-event-emitter';

export class ProxySocket extends ProxyEventEmitter {
  static pipeFns: string[] = ['destroy', 'address', 'write'];
  static interceptEvents: string[] = ['data', 'end', 'error', 'close', 'connect'];
  static createSocketClient = (host: string, port: number): ProxySocket => {
    return new ProxySocket(createConnection({ host, port }));
  };
  private socketEmit: (event: string, data: Buffer) => void;
  private ended: boolean = false;
  [x: string]: any;

  constructor(public socket: Socket) {
    super(socket, ProxySocket.pipeFns);
    this.onInit();
    this.associatedListener(['data']);
    this.associatedListener(['end', 'error', 'close', 'connect'], true);
    this.socketEmit = this.socket.emit;
    Object.defineProperty(this.socket, 'emit', {
      get: () => (...arg: any[]) => this.proxyEmit.apply(this, arg)
    });
  }

  private onInit() {
    // this.on('connect', () => console.log('proxy-->sock','连接成功'));
  }

  private proxyEmit(event: string, data: Buffer) {
    if (ProxySocket.interceptEvents.includes(event)) {
      // const result = this.emitSync(event, data);
      event !== 'error' && this.socketEmit.call(this.socket, event, data);
    } else {
      this.socketEmit.call(this.socket, event, data);
    }
  }

  pipe(proxySocket: ProxySocket | Socket) {
    if (proxySocket instanceof ProxySocket) {
      this.socket.pipe(proxySocket.socket);
    } else {
      this.socket.pipe(proxySocket);
    }
  }

  end() {
    if (!this.ended) {
      this.socket.end();
    }
    this.ended = true;
  }
}

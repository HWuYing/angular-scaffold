import { createConnection, Socket } from 'net';
import { ProxyEventEmitter } from './proxy-event-emitter';

export class ProxySocket extends ProxyEventEmitter {
  static pipeFns: string[] = ['destroy', 'address'];
  static createSocketClient = (host: string, port: number): ProxySocket => {
    return new ProxySocket(createConnection({ host, port }));
  }
  private socketEmit: (event: string, data: Buffer) => void;
  [x: string]: any;
  constructor(public socket: Socket) {
    super(socket, ProxySocket.pipeFns);
    this.onInit();
    this.associatedListener(['data', 'end', 'error', 'close']);
    this.associatedListener('connect', true);
    this.socketEmit = this.socket.emit;
    Object.defineProperty(this.socket, 'emit', {
      get: () => {
        return (...arg: any[]) => this.proxyEmit.apply(this, arg);
      }
    });
  }

  private onInit() {
    this.on('connect', () => console.log('proxy-->sock','连接成功'));
  }

  private proxyEmit(event: string, data: Buffer) {
    if (event === 'data') {
      console.log(data);
      console.log(this.emitAsync);
      this.emitAsync(event, data);
    } else {
      this.socketEmit.call(this.socket, event, data);
    }
  }

  write(data: Buffer) {
    this.socket.write(data);
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

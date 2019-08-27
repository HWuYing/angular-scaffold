import { ProxyEventEmitter } from "./proxy-event-emitter";

class ProxyProcess extends ProxyEventEmitter {
  constructor() {
    super(process);
    this.onInit();
  }

  bindUid(uid: string) {
    this.send({ event: 'bind-uid', data: uid });
  }

  deleteUid(uid: string) {
    this.send({ event: 'delete-uid', data: uid });
  }

  message(buffer: Buffer) {
    this.send({ event: 'udp-message', data: buffer });
  }

  private udpMessage({ data }: any) {
    this.emitAsync('udp-message', Buffer.from(data));
  }
  
  private send(message: any) {
    this.source.send(message);
  }

  private onInit() {
    this.source.on('message', this.eventBus.bind(this));
  }

  private eventBus({ event, data }: any) {
    switch(event) {
      case 'udp-message': this.udpMessage(data); break;
    }
  }
}

export const proxyProcess = new ProxyProcess();
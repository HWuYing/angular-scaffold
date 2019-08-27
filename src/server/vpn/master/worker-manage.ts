import { EventEmitter } from '../util/index';
import { PackageUtil } from '../util/package-separation';

export class WorkerManage extends EventEmitter {
  private uidSet: Set<string> = new Set();
  constructor(private id: string, private worker: any) {
    super();
    this.onInit();
  }

  send(mesage: any) {
    this.worker.send(mesage);
  }

  has(uid: string) {
    return this.uidSet.has(uid);
  }

  private distributionWorker({ data }: any) {
    const { uid, buffer } = PackageUtil.getUid(Buffer.from(data));
    const runWorker = manageList.getWorker(uid);
    // console.log('error--------->111');
    // const { cursor, data: _data } = PackageUtil.packageSigout(buffer);
    // console.log('cursor', cursor);
    // console.log(PackageUtil.unpacking(_data));
    if (runWorker) {
      runWorker.send({ event: 'udp-message', data: buffer });
    } else {
      console.log('error--------->', runWorker);
    }
  }


  private onInit() {
    this.worker.on('message', this.eventBus.bind(this));
  }

  private eventBus({ event, data }: any) {
    switch(event) {
      case 'bind-uid': this.bindUid(data); break;
      case 'delete-uid': this.deleteUid(data); break;
      case 'udp-message': this.distributionWorker(data);
    }
  }

  private deleteUid(uid: string) {
    this.uidSet.delete(uid);
  }

  private bindUid(uid: string) {
    this.uidSet.add(uid);
  }
}

class ManageList {
  private workers: WorkerManage[];
  constructor() {
    this.onInit();
  }

  onInit() {
    const workers = (process as any).getMasterWorkers();
    this.workers = Object.keys(workers).map((id: string) => new WorkerManage(id, workers[id]));
  }

  getWorker(uid: string): WorkerManage {
    return this.workers.filter((worker: WorkerManage) => worker.has(uid))[0];
  }
}

const manageList = new ManageList();

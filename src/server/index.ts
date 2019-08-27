import cluster from 'cluster';
import { cpus } from 'os';

if (cluster.isMaster) {
  let workerLength = 1; //cpus().length;
  
  while (workerLength > 0) {
    cluster.fork();
    workerLength--;
  }
  if (!Object.prototype.hasOwnProperty.call(process, 'getMasterWorkers')) {
    Object.defineProperty(process, 'getMasterWorkers', {
      value: () => cluster.workers
    });
  }
  require('./service');
  require('./vpn/master')
} else {
  require('./vpn');
}
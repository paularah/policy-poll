import cluster from 'cluster';
import os from 'os';
//main entry point
import startApp from './app';

/**
 * Check if current process is master, Get total CPU cores, Spawn a worker for every core.
 * creating a new process if a worker die
 * 
 */
startApp();


// if (cluster.isMaster) {
//     const cpuCount = os.cpus().length;
//     for (let j = 0; j < cpuCount; j++) {
//       cluster.fork();
//     }
//   } else {
//    startApp()
//   }
  
//   cluster.on('exit', function (worker) {
//     console.log(`Worker ${worker.id} died'`);
//     console.log(`Staring a new one...`);
//     cluster.fork();
//   });

const { Worker } = require('worker_threads');

// workerLocation= '../../../infrastructure/worker_threads/index';
class WorkerThreadCsvIngestion {
    constructor({
        workerLocation
    }){
        this.workerLocation= workerLocation
    }
    async run(filePath) {
        return new Promise((resolve, reject) => {

            const worker = new Worker(
                String(this.workerLocation),
                { workerData: { filePath } }
            );

            worker.on('message', (msg) => {
                if (msg.status === 'SUCCESS') resolve();
                else reject(new Error(msg.error));
            });

            worker.on('error', reject);

            worker.on('exit', (code) => {
                if (code !== 0)
                    reject( new Error(`Worker stopped with exit code ${code}`) );
            });

        });
    }
}

module.exports = { WorkerThreadCsvIngestion };

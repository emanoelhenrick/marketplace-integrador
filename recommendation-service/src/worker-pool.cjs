const { Worker } = require("node:worker_threads");

class WorkerPool {
  constructor(workerFile, size) {
    this.workerFile = workerFile;
    this.size = size;
    this.workers = [];
    this.queue = [];

    for (let i = 0; i < size; i++) {
      this.createWorker();
    }
  }

  createWorker() {
    const worker = new Worker(this.workerFile);

    const state = {
      worker,
      busy: false,
      currentTask: null,
    };

    worker.on("message", (message) => {
      const task = state.currentTask;

      if (!task) return;

      state.currentTask = null;
      state.busy = false;

      if (message.error) {
        task.reject(new Error(message.error));
      } else {
        task.resolve(message.result);
      }

      this.dispatch();
    });

    worker.on("error", (error) => {
      const task = state.currentTask;

      if (task) {
        task.reject(error);
      }

      state.currentTask = null;
      state.busy = false;
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        const task = state.currentTask;

        if (task) {
          task.reject(
            new Error(`Worker encerrado inesperadamente: ${code}`)
          );
        }

        state.currentTask = null;
        state.busy = false;
      }
    });

    this.workers.push(state);
  }

  run(products) {
    if (!products.length) {
      return Promise.resolve([]);
    }

    const chunkSize = Math.ceil(products.length / this.size);
    const chunks = [];

    for (let i = 0; i < products.length; i += chunkSize) {
      chunks.push(products.slice(i, i + chunkSize));
    }

    const tasks = chunks.map((chunk) => {
      return new Promise((resolve, reject) => {
        this.queue.push({
          chunk,
          catalog: products,
          resolve,
          reject,
        });
      });
    });

    this.dispatch();

    return Promise.all(tasks).then((results) => results.flat());
  }

  dispatch() {
    for (const state of this.workers) {
      if (state.busy || this.queue.length === 0) {
        continue;
      }

      const task = this.queue.shift();

      state.busy = true;
      state.currentTask = task;

      state.worker.postMessage({
        products: task.chunk,
        catalog: task.catalog,
      });
    }
  }

  async close() {
    await Promise.all(
      this.workers.map((state) => state.worker.terminate())
    );
  }
}

module.exports = { WorkerPool };
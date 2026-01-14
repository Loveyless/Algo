// 带并发限制的异步调度器

class Scheduler {
  constructor(maxConcurrent = 2) {
    this.maxConcurrent = maxConcurrent; // 最大并发数
    this.runningCount = 0; // 当前运行数
    this.waitingQueue = []; // 等待队列：元素为 { task, resolve, reject }
  }

  add(task) {
    if (typeof task !== 'function') {
      return Promise.reject(new TypeError('task 必须是函数'));
    }

    // task 传“函数”而不是直接传 Promise：为了把“何时开始执行”交给调度器控制
    return new Promise((resolve, reject) => {
      this.waitingQueue.push({ task, resolve, reject });
      this.tryRun();
    });
  }

  tryRun() {
    // 只要还有空位，就不断从队列里启动任务
    while (this.runningCount < this.maxConcurrent && this.waitingQueue.length > 0) {
      this.startNext();
    }
  }

  startNext() {
    const job = this.waitingQueue.shift();
    if (!job) return;

    this.runningCount++;

    // 不兼容写法（示意）：如果 task 同步抛错或返回非 Promise，会报错或导致名额无法释放
    // const resultPromise = job.task();
    // resultPromise.then(job.resolve, job.reject).finally(() => {
    //   this.runningCount--;
    //   this.tryRun();
    // });

    // 兼容写法：用 Promise.resolve 包一层，统一处理 task 同步抛错/返回非 Promise 的情况
    Promise.resolve()
      .then(job.task)
      .then(job.resolve, job.reject)
      .finally(() => {
        this.runningCount--;
        this.tryRun();
      });
  }
}
module.exports = { Scheduler };

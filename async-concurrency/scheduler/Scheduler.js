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

/*测试代码*/
const timeout = (time) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });

const scheduler = new Scheduler();

const addTask = (time, order) => {
  scheduler.add(() => timeout(time)).then(() => console.log(order));
};

addTask(1000, '1');
addTask(500, '2');
addTask(300, '3');
addTask(400, '4');
// 预期输出：2 3 1 4

/*
附加说明

1) 为什么 add 接收的是 “() => Promise” 而不是直接接收 Promise？
   - 如果你传的是 Promise，那它在 add 的那一刻就已经开始执行了，调度器就失去“控制开始时机”的能力。
   - 传函数可以把执行延后到 startNext()，这样才能严格做到并发上限。

2) 调度器的核心流程是什么？
   - add：把任务包装成 { task, resolve, reject } 放进等待队列，然后尝试调度
   - tryRun：只要还有空位，就启动下一个任务
   - startNext：占用一个名额 -> 执行 task -> 完成后释放名额 -> 再次尝试调度

3) 为什么要 Promise.resolve().then(task)？
   - 有些 task 可能会同步 throw，或者返回一个非 Promise 值；这一层能把它们统一成 Promise 链路处理
   - 无论成功/失败，finally 都会释放名额，避免任务失败后“卡住不再调度”
*/

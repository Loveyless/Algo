// 带并发限制的异步调度器 Scheduler（同时最多运行 maxCount 个任务）
//
// 【循序渐进】怎么想到它？
// 1) 前端皮肤：把 add(task) 当成“发起请求/上传”，maxCount 就是“并发上限”（请求池）。
// 2) 算法内核：FIFO 队列 + 计数信号量。
//    - runningCount：当前进行中的任务数（占用的并发许可）
//    - queue：等待启动的任务（保存 run 函数，等有空位再执行）
// 3) 启动顺序 vs 完成顺序：FIFO 只保证“启动顺序”，完成顺序由耗时决定。
// 4) 关键不变量：
//    - 0 <= runningCount <= maxCount
//    - 每个任务：启动时 +1 一次，结束时 -1 一次（无论 resolve/reject）
// 5) 关键流程：
//    - add(): 包装一个 run()；有空位就直接 run()，否则把 run 放入队列等待。
//    - run(): runningCount++ → 执行 task → finally 里 runningCount-- → 拉起队列里的下一个。
// 6) 复杂度：
//    - 入队 O(1)
//    - 出队：用 head 指针均摊 O(1)（避免 Array.shift 的整体搬移）
//    - 空间 O(队列长度)
// 7) V8 视角（性能要点）：
//    - 避免 shift()：大队列会触发元素搬移/重建索引；head 指针更稳。
//    - 构造函数里一次性初始化字段：Hidden Class 更稳定。
//    - Promise 的 then/finally 走 microtask：finally 里“释放许可 → 拉起下一个”的时序更可控。

class Scheduler {
  constructor(maxCount = 2) {
    this.maxCount = maxCount;

    /** @type {Array<() => void>} */
    this.queue = [];
    this.queueHeadIndex = 0;

    this.runningCount = 0;
  }

  /**
   * 添加一个任务。
   * - task 必须是函数：返回 Promise 或普通值都可以。
   * - add() 返回的 Promise 会跟随该 task 的完成/失败。
   * @param {() => Promise<unknown> | unknown} task
   * @returns {Promise<unknown>}
   */
  add(task) {
    return new Promise((resolve, reject) => {
      const run = () => {
        this.runningCount += 1;

        // 用 Promise.resolve().then(task) 统一处理：
        // - task 同步抛错会转成 rejection
        // - task 返回普通值也能被 Promise 链接住
        Promise.resolve()
          .then(task)
          .then(resolve, reject)
          .finally(() => {
            this.runningCount -= 1;

            const next = this.queue[this.queueHeadIndex];
            if (!next) return;

            this.queueHeadIndex += 1;
            next();

            // 周期性“压缩”队列：避免 head 一直增大导致数组无限增长。
            if (this.queueHeadIndex > 1024 && this.queueHeadIndex * 2 > this.queue.length) {
              this.queue = this.queue.slice(this.queueHeadIndex);
              this.queueHeadIndex = 0;
            }
          });
      };

      if (this.runningCount < this.maxCount) run();
      else this.queue.push(run);
    });
  }
}

/*测试代码，请勿修改*/
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
// output:2 3 1 4
//一开始，1、2两个任务进入队列
//500ms时，2完成，输出2，任务3进队
//800ms时，3完成，输出3，任务4进队
//1000ms时，1完成，输出1
//1200ms时，4完成，输出4
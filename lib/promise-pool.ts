type Task<R = unknown> = () => Promise<R>;
export default class PromisePool {
  private size: number;
  private queue: Set<Task>;
  private waitQueue: Task[];
  constructor(size: number) {
    this.size = size;
    this.queue = new Set();
    this.waitQueue = [];
  }

  add(
    task: Task,
  ) {
    return new Promise((resolve, reject) => {
      const handle = () => {
        return task()
          .finally(() => {
            this.queue.delete(handle);
            const f = this.waitQueue.shift();
            if (f) {
              this.queue.add(f);
            }
            setTimeout(() => {
              f?.();
            });
          })
          .then(resolve)
          .catch(reject);
      };
      if (this.queue.size >= this.size) {
        this.waitQueue.push(handle);
        return;
      }
      this.queue.add(handle);
      handle();
    });
  }
}

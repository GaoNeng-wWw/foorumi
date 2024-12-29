export const usePromisePool = <R, F extends (...args: any[]) => Promise<R>>(fn: F, limit: number) => {
  type T = Parameters<F>;
  const waitQueue: (
    () => void
  )[] = [];
  let runnedCount = 0;
  const run = (...args: T[]) => {
    return fn(...args)
      .finally(() => {
        runnedCount -= 1;
        if (waitQueue.length) {
          waitQueue.shift()!();
        }
      });
  };
  return (...args: T[]) => {
    const { promise, resolve } = Promise.withResolvers<Promise<R>>();
    if (runnedCount >= limit) {
      const g = () => {
        runnedCount += 1;
        const ret = resolve(run(...args));
        return ret;
      };
      waitQueue.push(g);
      return promise;
    } else {
      runnedCount += 1;
      return run(...args);
    }
  };
};

import type { F, L } from 'ts-toolbelt';

export const usePromisePool = <Fn extends F.Function>(fn: Fn, limit: number) => {
  type T = Parameters<Fn>;
  type R = ReturnType<Fn>;
  const waitQueue: (
    () => void
  )[] = [];
  let runnedCount = 0;
  const run = (...args: any[]) => {
    return fn(...args)
      .finally(() => {
        runnedCount -= 1;
        if (waitQueue.length) {
          waitQueue.shift()!();
        }
      });
  };
  return ((...args: any[]) => {
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
  }) as Fn;
};

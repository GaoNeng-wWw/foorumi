// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Unit<T = any> = () => T;
export type Binary = (lhs: Unit, rhs: Unit) => Unit;

export const Literal: <T>(val: T) => () => T = <T>(val: T): () => T => () => val;

export const And: Binary = <L, R>(lhs: Unit<L>, rhs: Unit<R>) => {
  return () => {
    return lhs() && rhs();
  };
};
export const Or: Binary = (lhs, rhs) => {
  return () => {
    return lhs() || rhs();
  };
};

export const Subset = <T>(lhs: Unit<T[]>, rhs: Unit<T[]>) => {
  return () => {
    const _rhs = rhs();
    return lhs().some(val => _rhs.includes(val));
  };
};

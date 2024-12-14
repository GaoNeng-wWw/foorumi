export type ThreadContext = {
  id: ComputedRef<number>;
};
export type ThreadItemContext = {
  threadId: ComputedRef<number>;
};

export const THREAD_ITEM_CONTEXT_KEY = Symbol();

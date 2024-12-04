import type { TreeData } from './index.vue';

export const TREE_SYMBOL = Symbol();
export type TREE_PROVIDER<T> = {
  openId: Ref<string[]>;
  toggle: (id: string, node: TreeData<T>) => void;
  selected: Ref<TreeData<T>[]>;
  select: (node: TreeData<T>) => void;
};

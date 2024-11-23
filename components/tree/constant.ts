import type { TreeData } from './tree.vue';

export const TREE_SYMBOL = Symbol();
export type TREE_PROVIDER = {
  openId: Ref<string[]>;
  toggle: (id: string, node: TreeData) => void;
};

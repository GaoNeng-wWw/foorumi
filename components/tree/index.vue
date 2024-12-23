<template>
  <tree-list
    :data="data"
    :padding="false"
  />
</template>

<script lang="ts" setup generic="T">
import { TREE_SYMBOL, type TREE_PROVIDER } from './constant';

export interface TreeData<R = {
  [x: string]: unknown;
}> {
  label: string;
  id: string;
  children?: TreeData<R>[];
  meta?: R;
}
export type FlatTreeData<R> = {
  parent: string | null;
} & TreeData<R>;

const { data = [], multiple = false, defaultSelect = [] } = defineProps<{
  data?: TreeData<T>[];
  multiple?: boolean;
  defaultSelect?: string[];
}>();

const emits = defineEmits<{
  nodeClick: [TreeData<T>];
  select: [TreeData<T>[]];
}>();
const openId = ref<string[]>([]);
const selectedData: Ref<FlatTreeData<T>[]> = ref([]);

const flatData = (items: TreeData<T>[], parent: string | null = null) => {
  const ans: FlatTreeData<T>[] = [];
  for (const item of items) {
    ans.push({
      ...item,
      parent,
    }, ...flatData(item.children ?? [], item.id));
  }
  return ans;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selected: Ref<TreeData<any>[]> = ref(selectedData);
const toggle = (id: string, node: TreeData<T>) => {
  if (openId.value.includes(id)) {
    openId.value = openId.value.filter(opened => opened !== id);
  } else {
    openId.value.push(id);
  }
  emits('nodeClick', node);
};
const select = (node: TreeData<T>) => {
  if (!multiple) {
    if (selected.value.includes(node)) {
      selected.value = [];
    } else {
      selected.value = [node];
    }
    emits('select', selected.value);
    return;
  }
  if (selected.value.includes(node)) {
    selected.value = selected.value.filter(selectedNode => selectedNode !== node);
    emits('select', selected.value);
    return;
  }
  selected.value.push(node);
  emits('select', selected.value);
};
provide<TREE_PROVIDER<T>>(TREE_SYMBOL, { openId, toggle, select, selected });
watch(() => [data, defaultSelect], () => {
  selectedData.value = flatData(data).filter(item => defaultSelect.includes(item.id)) ?? [];
  openId.value = selectedData.value.map(node => node.parent).filter(val => val !== null);
}, { immediate: true, deep: true });
watch(() => selectedData, () => {
  selected.value = selectedData.value;
}, { deep: true, immediate: true });
</script>

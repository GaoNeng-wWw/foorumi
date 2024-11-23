<template>
  <slot />
</template>

<script lang="ts" setup>
import { TREE_SYMBOL, type TREE_PROVIDER } from './constant';
import type { TreeData } from './tree.vue';

const emits = defineEmits<{
  nodeClick: [TreeData];
}>();
const openId = ref<string[]>([]);
const toggle = (id: string, node: TreeData) => {
  if (openId.value.includes(id)) {
    openId.value = openId.value.filter(opened => opened !== id);
  } else {
    openId.value.push(id);
  }
  emits('nodeClick', node);
};
provide<TREE_PROVIDER>(TREE_SYMBOL, { openId, toggle });
</script>

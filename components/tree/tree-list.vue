<script lang="ts" setup generic="T">
import { TransitionCollapse } from '@miraiui-org/vue-transition-collapse';
import { TREE_SYMBOL, type TREE_PROVIDER } from './constant';
import type { TreeData } from './index.vue';

const { data, padding = true } = defineProps<{
  data?: TreeData<T>[];
  padding: boolean;
}>();

const { openId, toggle, select, selected } = inject<TREE_PROVIDER<T>>(TREE_SYMBOL)!;
const onClickPrefix = (id: string, node: TreeData<T>) => {
  toggle(id, node);
};
const onClickNode = (node: TreeData<T>) => {
  select(node);
};
</script>

<template>
  <div
    :data-padding="padding"
    class="w-full group text-foreground data-[padding]:px-4"
  >
    <template
      v-for="(node, idx) in data"
      :key="idx"
    >
      <tree-node
        :id="node.id"
        :leaf="!node.children || !node.children.length"
        :expand="openId.includes(node.id)"
        :selected="selected.includes(node)"
        :padding="padding"
        @click-prefix="(id: string) => onClickPrefix(id, node)"
        @click-node="() => onClickNode(node)"
      >
        {{ node.label }}
      </tree-node>
      <transition-collapse>
        <tree-list
          v-if="openId.includes(node.id)"
          :data="node.children"
          padding
        />
      </transition-collapse>
    </template>
  </div>
</template>

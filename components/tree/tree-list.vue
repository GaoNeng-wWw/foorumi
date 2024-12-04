<script lang="ts" setup generic="T">
import { TransitionCollapse } from '@miraiui-org/vue-transition-collapse';
import { TREE_SYMBOL, type TREE_PROVIDER } from './constant';
import type { TreeData } from './index.vue';

const { data } = defineProps<{
  data?: TreeData<T>[];
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
  <div class="w-full px-2 text-foreground">
    <template
      v-for="(node, idx) in data"
      :key="idx"
    >
      <tree-node
        :id="node.id"
        :leaf="!node.children || !node.children.length"
        :expand="openId.includes(node.id)"
        :selected="selected.includes(node)"
        @click-prefix="(id: string) => onClickPrefix(id, node)"
        @click-node="() => onClickNode(node)"
      >
        {{ node.label }}
      </tree-node>
      <transition-collapse>
        <tree-list
          v-if="openId.includes(node.id)"
          :data="node.children"
        />
      </transition-collapse>
    </template>
  </div>
</template>

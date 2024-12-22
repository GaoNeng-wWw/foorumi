<script lang="ts" setup generic="T extends string | number">
import type { PopoverContentProps } from 'radix-vue';
import type { TreeData } from '../tree/index.vue';

export type TreeSelectData<T> = {
  label: string;
  value: T;
  children?: TreeSelectData<T>[];
};

const show = defineModel<boolean>('show', { required: false, default: false });
const node = defineModel<TreeSelectData<T | undefined> | null>('node', { required: false });
const value = defineModel<string | null>('value', { required: false });

const storgeValue = ref(value.value ?? '');

const { align = 'center', defaultSelectId = [], destory = false, data = [], contentWidthFollowTrigger = false, sideOffset = 8, contentClass = '', autoClose = false } = defineProps<{
  data?: TreeSelectData<T>[];
  contentWidthFollowTrigger?: boolean;
  sideOffset?: number;
  contentClass?: string;
  autoClose?: boolean;
  destory?: boolean;
  defaultSelectId?: number[];
  align?: PopoverContentProps['align'];
}>();

const defaultSelect: Ref<string[]> = ref([]);

watch(() => defaultSelectId, () => {
  defaultSelect.value = defaultSelectId.map(id => id.toString()) ?? [];
}, { immediate: true, deep: true });

const transform = (treeData: TreeSelectData<T>): TreeData<{ value: T }> => {
  return {
    id: treeData.value.toString(),
    label: treeData.label,
    children: treeData.children?.map(child => transform(child)),
    meta: {
      value: treeData.value,
    },
  };
};

const realData = computed(() => {
  return data.map(item => transform(item));
});
const onSelect = (_node: TreeData<{ value: T }>[]) => {
  if (!_node || !_node.length) {
    value.value = '';
    node.value = null;
    return;
  }
  const values = _node.filter(item => item.meta && item.meta.value).map(item => item.meta?.value).filter(item => item !== undefined);
  value.value = values[0] === null || values[0] === undefined ? null : values[0].toString() ?? '';

  node.value = {
    label: _node[0].label,
    value: _node[0].meta?.value,
  };
};

watch(() => node, () => {
  storgeValue.value = node.value?.value?.toString() ?? '';
});
watch(value, () => {
  storgeValue.value = value.value?.toString() ?? '';
}, { immediate: true });
</script>

<template>
  <app-popover
    v-model:open="show"
    :side-offset="sideOffset"
    :content-follow-trigger-width="contentWidthFollowTrigger"
    :content-class="contentClass"
    :align="align"
    :auto-close="autoClose"
    :destory="destory"
  >
    <template #trigger>
      <slot name="trigger">
        <base-input
          v-model="storgeValue"
          class="rounded-md overflow-hidden [&_input]:cursor-pointer pointer-events-none"
        />
      </slot>
    </template>
    <div class="px-1 py-2 bg-default-200 rounded">
      <tree
        v-if="realData.length"
        :data="realData"
        :default-select="defaultSelect"
        @select="onSelect"
      />
      <slot
        v-if="!realData.length"
        name="empty"
      />
    </div>
  </app-popover>
</template>

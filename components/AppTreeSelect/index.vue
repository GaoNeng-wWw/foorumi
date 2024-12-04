<script lang="ts" setup generic="T extends string | number">
import type { TreeData } from '../tree/index.vue';

export type TreeSelectData<T> = {
  label: string;
  value: T;
  children?: TreeSelectData<T>[];
};

const show = defineModel<boolean>('show', { required: false, default: false });
const node = defineModel<TreeSelectData<T>>('node', { required: false });
const value = defineModel<string | null>('value', { required: false });

const storgeValue = ref(value.value ?? '');

const { defaultSelectId = [], destory = false, data = [], contentWidthFollowTrigger = false, sideOffset = 8, contentClass = '', autoClose = false } = defineProps<{
  data?: TreeSelectData<T>[];
  contentWidthFollowTrigger?: boolean;
  sideOffset?: number;
  contentClass?: string;
  autoClose?: boolean;
  destory?: boolean;
  defaultSelectId?: number[];
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
const onSelect = (node: TreeData<{ value: T }>[]) => {
  const values = node.filter(item => item.meta && item.meta.value).map(item => item.meta?.value).filter(item => item !== undefined);
  value.value = values[0] === null || values[0] === undefined ? null : values[0].toString() ?? '';
};

watch(() => node, () => {
  storgeValue.value = node.value?.value.toString() ?? '';
});
watch(value, () => {
  storgeValue.value = value.value?.toString() ?? '';
}, { immediate: true });
</script>

<template>
  <app-popover
    v-model:open="show"
    :side-offset="sideOffset"
    :content-width-follow-trigger="contentWidthFollowTrigger"
    :content-class="contentClass"
    :align="'end'"
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
        :data="realData"
        :default-select="defaultSelect"
        @select="onSelect"
      />
    </div>
  </app-popover>
</template>

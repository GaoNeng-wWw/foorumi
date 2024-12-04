<script lang="ts" setup>
import { ChevronDownIcon } from '@heroicons/vue/24/solid';

const { id, leaf, selected, expand } = defineProps<{
  id: string;
  leaf?: boolean;
  selected?: boolean;
  expand?: boolean;
  isFirst?: boolean;
}>();
const emits = defineEmits<{
  clickNode: [string];
  clickPrefix: [string];
}>();
const onClickPrefix = () => {
  emits('clickPrefix', id);
};
const onClickNode = () => {
  emits('clickNode', id);
};
</script>

<template>
  <div

    :data-leaf="leaf"
    :data-selected="selected"
    :data-expand="expand"
    class="w-full flex items-center justify-center gap-2 group data-[leaf=true]:px-8"
  >
    <div
      v-if="!leaf "
      class="w-fit cursor-pointer mt-0.5 hover:bg-default p-1 rounded-md transition duration-300"
      @click="onClickPrefix"
    >
      <slot name="prefix">
        <chevron-down-icon
          v-if="!leaf"
          class="size-4 -rotate-90 group-data-[expand=true]:rotate-0 transition will-change-auto"
        />
      </slot>
    </div>
    <div
      class="flex-auto group-data-[selected=true]:bg-primary-200 hover:bg-default p-1 my-0.5 px-2 rounded-md cursor-pointer transition duration-300"
      @click="onClickNode"
    >
      <slot />
    </div>
    <div
      v-if="$slots.suffix"
      class="w-fit"
    >
      <slot name="suffix" />
    </div>
  </div>
</template>

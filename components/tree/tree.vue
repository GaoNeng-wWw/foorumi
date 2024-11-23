<script lang="ts" setup>
import { TransitionCollapse } from '@miraiui-org/vue-transition-collapse';
import { ChevronDownIcon } from '@heroicons/vue/24/solid';
import { TREE_SYMBOL, type TREE_PROVIDER } from './constant';

export interface TreeData {
  label: string;
  id: string;
  children?: TreeData[];
  meta?: Record<string, unknown>;
}
const { data } = defineProps<{
  data?: TreeData[];
}>();

const { openId, toggle } = inject<TREE_PROVIDER>(TREE_SYMBOL)!;
</script>

<template>
  <div
    v-if="data"
    class="w-full px-2 text-foreground spacey--2"
  >
    <div
      v-for="item in data"
      :key="item.label"
      class="w-full group"
      :data-leaf="!item.children || !item.children.length"
    >
      <div
        class="cursor-pointer flex gap-2 group items-center"
        :data-show="openId.includes(item.id)"
        @click.stop="() => toggle(item.id, item)"
      >
        <chevron-down-icon
          class="size-4 transition group-data-[show=false]:-rotate-90 group-data-[leaf=true]:opacity-0"
        />
        {{ item.label }}
      </div>
      <transition-collapse>
        <div
          v-if="openId.includes(item.id)"
        >
          <tree :data="item.children" />
        </div>
      </transition-collapse>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PaginationEllipsis, PaginationFirst, PaginationLast, PaginationList, PaginationListItem, PaginationNext, PaginationPrev, PaginationRoot } from 'radix-vue';
import { ChevronLeftIcon, ChevronDoubleLeftIcon, ChevronRightIcon, ChevronDoubleRightIcon } from '@heroicons/vue/24/solid';

const { current = 1, totalItem, pageSize } = defineProps<{
  current?: number;
  totalItem?: number;
  pageSize?: number;
}>();

const currentPage = ref(current);

const emits = defineEmits<{
  pageUpdate: [number];
}>();

watch(currentPage, () => {
  emits('pageUpdate', currentPage.value);
});
</script>

<template>
  <pagination-root
    v-model:page="currentPage"
    :total="totalItem"
    :sibling-count="1"
    :default-page="current"
    :items-per-page="pageSize"
    show-edges
    class="px-4 flex"
  >
    <pagination-list
      v-slot="{ items }"
      class="flex items-center gap-2"
    >
      <PaginationFirst class="w-5 flex items-center justify-center disabled:opacity-50 focus-within:outline focus-within:outline-1 focus-within:outline-offset-1 rounded">
        <chevron-double-left-icon />
      </PaginationFirst>
      <PaginationPrev class="w-5 flex items-center justify-center mr-4 disabled:opacity-50 focus-within:outline focus-within:outline-1 focus-within:outline-offset-1 rounded">
        <chevron-left-icon />
      </PaginationPrev>
      <template v-for="(page, idx) in items">
        <pagination-list-item
          v-if="page.type==='page'"
          :key="idx"
          :value="page.value"
          class="text-sm leading-none p-2 border border-default rounded data-[selected]:bg-default transition"
        />
        <pagination-ellipsis
          v-else
          :key="page.type"
          :index="idx"
          class="text-sm flex items-center justify-center"
        >
          &#8230;
        </pagination-ellipsis>
      </template>
      <PaginationNext class="w-5 h-5 flex items-center justify-center ml-4 disabled:opacity-50 focus-within:outline focus-within:outline-1 focus-within:outline-offset-1 rounded">
        <chevron-right-icon />
      </PaginationNext>
      <PaginationLast class="w-5 h-5 flex items-center justify-center disabled:opacity-50 focus-within:outline focus-within:outline-1 focus-within:outline-offset-1 rounded">
        <chevron-double-right-icon />
      </PaginationLast>
    </pagination-list>
  </pagination-root>
</template>

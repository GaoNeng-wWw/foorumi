<script setup lang="ts">
import { PaginationEllipsis, PaginationFirst, PaginationLast, PaginationList, PaginationListItem, PaginationNext, PaginationPrev, PaginationRoot } from 'radix-vue';
import { ChevronLeftIcon, ChevronDoubleLeftIcon, ChevronRightIcon, ChevronDoubleRightIcon } from '@heroicons/vue/24/solid';

definePageMeta({
  auth: true,
});
</script>

<template>
  <nuxt-layout
    name="side"
    direction="rtl"
    aside-sticky
    aside-external-class="w-32 sm:hidden"
    layout-root-external-class="gap-2 py-4 z-0"
  >
    <template
      #aside
    >
      <div class="w-full flex flex-col items-center gap-2">
        <div class="w-full aspect-square bg-red-500" />
        <div class="w-fit">
          <nuxt-link class="hover:text-primary-500 cursor-pointer transition">
            Author Name
          </nuxt-link>
        </div>
      </div>
    </template>
    <div
      class="w-full min-h-full space-y-2"
    >
      <thread-list />
      <pagination-root
        :total="1000"
        :sibling-count="1"
        :default-page="1"
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
              class=" tetx-sm leading-none p-2 border border-default rounded data-[selected]:bg-default transition"
            />
          </template>
          <PaginationNext class="w-5 h-5 flex items-center justify-center ml-4 disabled:opacity-50 focus-within:outline focus-within:outline-1 focus-within:outline-offset-1 rounded">
            <chevron-right-icon />
          </PaginationNext>
          <PaginationLast class="w-5 h-5 flex items-center justify-center disabled:opacity-50 focus-within:outline focus-within:outline-1 focus-within:outline-offset-1 rounded">
            <chevron-double-right-icon />
          </PaginationLast>
        </pagination-list>
      </pagination-root>
      <client-only>
        <comment-editor />
      </client-only>
    </div>
  </nuxt-layout>
</template>

<script lang="ts" setup>
import { ChevronLeftIcon } from '@heroicons/vue/24/solid';
import type { ThreadContext } from './context.type';

const { id } = defineProps<{
  id: number;
}>();
const { threadList: staticThreadList, page, totalItems, size, author_id, to, filterByAuthorId, toLast, threadTitle } = useThreads({
  id: computed(() => id),
});
const threadList = computed(() => [...staticThreadList.value]);
const onPageUpdate = (page: number) => {
  to(page);
  scrollTo({ top: 0, behavior: 'smooth' });
};
defineExpose({ toLast });
provide<ThreadContext>('THREAD', { id: computed(() => id) });
</script>

<template>
  <div class="w-full rounded-md">
    <template v-if="threadList && threadList.length">
      <thread-item
        v-for="(thread, idx) in threadList"
        :key="idx"
        :show-header="idx===0"
        :author-id="thread.authorId"
        :author-name="thread.authorName"
        :content="thread.content"
        :floor="thread.floor"
        :thread-id="thread.id"
        :hidden="thread.hidden"
        :hidden-reason="thread.reason"
        :title="threadTitle"
      >
        <template #title-prefix>
          <ghost-button @click="() => $router.back()">
            <chevron-left-icon class="size-6 flex-shrink-0" />
          </ghost-button>
        </template>
        <template #title-suffix>
          <ghost-button
            :active="author_id === thread.authorId"
            @click="() => filterByAuthorId(thread.authorId)"
          >
            只看楼主
          </ghost-button>
        </template>
      </thread-item>
    </template>
    <div class="mt-2">
      <pagination
        :total-item="totalItems"
        :page-size="size"
        :current="page"
        @page-update="onPageUpdate"
      />
    </div>
  </div>
</template>

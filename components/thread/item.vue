<script lang="ts" setup>
import { THREAD_ITEM_CONTEXT_KEY, type ThreadContext } from './context.type';

const showReply = ref(false);

const {
  showHeader = false,
  showToolBar = true,
  showAside = true,
  authorId,
  authorName,
  content,
  floor = '',
  threadId,
  hidden,
  hiddenReason,
  title,
} = defineProps<{
  showHeader?: boolean;
  showToolBar?: boolean;
  showAside?: boolean;
  authorId: number;
  title: string;
  authorName: string;
  content: string;
  floor: string;
  threadId: number;
  hidden: boolean;
  hiddenReason: string;
}>();
const isHidden = ref(hidden);
const reason = ref(hiddenReason);
const _content = ref(content);
const { id } = inject<ThreadContext>('THREAD')!;
const onHiddenSuccess = (_reason: string) => {
  reason.value = _reason;
  isHidden.value = true;
};
const patch = (content: string) => {
  _content.value = content;
};
provide(THREAD_ITEM_CONTEXT_KEY, {
  threadId: computed(() => threadId),
});
watch(() => hidden, () => {
  isHidden.value = hidden;
}, { immediate: true });
watch(() => hiddenReason, () => {
  reason.value = hiddenReason;
}, { immediate: true });
watch(() => content, () => {
  _content.value = content;
}, { immediate: true });
console.log(title);
</script>

<template>
  <div class="w-full z-0 group first:pt-4">
    <thread-header
      v-if="showHeader"
      :title="title"
    >
      <template #prefix>
        <slot name="title-prefix" />
      </template>
      <template #suffix>
        <slot name="title-suffix" />
      </template>
    </thread-header>
    <div class="w-full px-4 grid grid-cols-[120px,minmax(0,1fr)]">
      <thread-aside
        v-if="showAside"
        :author-id="authorId"
        :author-name="authorName"
      />
      <div class="flex flex-col justify-between px-4 py-4 bg-default-200 border-b border-default-400 min-h-60">
        <div class="text-base text-foreground leading-7 flex-shrink-0 flex-grow basis-60">
          <!-- We filter html in server side -->
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div
            v-if="!isHidden"
            v-html="_content"
          />
          <app-alert
            v-else
            type="warning"
            title="该楼层被管理员隐藏"
            :content="`理由是: ${hiddenReason}`"
          />
        </div>
        <div class="">
          <thread-toolbar
            v-if="showToolBar"
            v-model="showReply"
            v-model:is-hidden="isHidden"
            v-model:reason="reason"
            :floor="floor"
            :author-id="authorId"
            :patch="patch"
            @hidden-success="onHiddenSuccess"
          />
          <div class="w-full">
            <reply-list
              :id="id"
              :show="showReply"
              :floor="floor"
              class="border-0 bg-default-300"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

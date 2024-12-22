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
  files: ThreadFile[];
}>();
const isHidden = ref(hidden);
const reason = ref(hiddenReason);
const _content = ref(content);
const { id } = inject<ThreadContext>('THREAD')!;
const avatarUrl = ref('/images/a4fa5161369727154bc3a7d1c52bb9c0.png');
$fetch(`/api/avatar/${unref(authorId)}`, { method: 'get', onResponseError: () => {}, onRequestError: () => {} })
  .then(resp => resp as Blob)
  .then (blob => URL.createObjectURL(blob))
  .then((url) => {
    avatarUrl.value = url;
  })
  .catch(() => {});
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
    <div class="w-full px-4 grid grid-cols-1 md:grid-cols-[120px,minmax(0,1fr)]">
      <thread-aside
        class="hidden md:flex"
        :author-id="authorId"
        :author-name="authorName"
        :author-avatar="avatarUrl"
      />
      <div class="flex flex-col justify-between md:px-4 md:py-4 bg-default-200 border-b border-default-400 min-h-60">
        <thread-author
          :author-id="authorId"
          :author-name="authorName"
          class="flex !flex-row border-none md:hidden p-4 bg-default"
          avatar-class="!size-10 !m-0"
        />
        <div class="px-4 mt-4 md:mt-0 md:p-0 text-base text-foreground leading-7 flex-shrink-0 flex-grow basis-60">
          <!-- We filter html in server side -->
          <div v-if="!isHidden">
            <!-- eslint-disable vue/no-v-html -->
            <div
              v-html="_content"
            />
          </div>
          <app-alert
            v-else
            type="warning"
            title="该楼层被管理员隐藏"
            :content="`理由是: ${hiddenReason}`"
          />
        </div>
        <div
          v-if="files.length"
          class="w-full space-y-2 p-2 bg-default"
        >
          <p>附件:</p>
          <div class="flex flex-wrap gap-2">
            <thread-file
              v-for="file in files"
              :key="file.hash"
              :hash="file.hash"
              :raw-name="file.rawName"
            />
          </div>
        </div>
        <div class="pb-4 p-4 md:px-0 md:pb-0">
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

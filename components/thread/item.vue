<script lang="ts" setup>
import type { ThreadContext } from './context.type';

const showReply = ref(false);

const {
  showHeader = false,
  showToolBar = true,
  showAside = true,
  authorId,
  authorName,
  content,
  floor = '',
} = defineProps<{
  showHeader?: boolean;
  showToolBar?: boolean;
  showAside?: boolean;
  authorId: number;
  authorName: string;
  content: string;
  floor: string;
}>();
const { id } = inject<ThreadContext>('THREAD')!;
</script>

<template>
  <div class="w-full z-0 group first:pt-4">
    <thread-header
      v-if="showHeader"
      title="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus eos asperiores itaque omnis quam, iure delectus beatae quia, voluptate sed sequi ad cupiditate eligendi ipsam? Deleniti a eligendi inventore sint."
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
          <div v-html="content" />
        </div>
        <div class="">
          <thread-toolbar
            v-if="showToolBar"
            v-model="showReply"
            :floor="floor"
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

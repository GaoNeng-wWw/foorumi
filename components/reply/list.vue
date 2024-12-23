<script lang="ts" setup>
import { TransitionCollapse } from '@miraiui-org/vue-transition-collapse';

const { show = false, id, floor } = defineProps<{
  show?: boolean;
  id: number;
  floor: string;
}>();

const page = ref(1);
const { execute, threadReplies, total, size, to, sendReply } = useThreadReply({ immediate: false, page, id, floor: computed(() => floor) });
const emits = defineEmits<{
  reply: [{ content: string; success: () => void }];
}>();
watchDebounced([() => show], () => {
  if (!show) {
    return;
  }
  execute();
}, { debounce: 200, immediate: true, deep: true });
const onClickSend = (args: { content: string; success: () => void }) => {
  emits('reply', args);
  sendReply(args.content)
    .then(() => {
      args.success();
    });
};
</script>

<template>
  <transition-collapse>
    <div
      v-if="show"
      class="w-full dark:bg-default-100 bg-default-50 border border-default-100 rounded-md mt-2"
    >
      <div class="p-4 space-y-4">
        <template
          v-for="(reply, idx) in threadReplies"
          :key="idx"
        >
          <reply-item
            :content="reply.content"
            :author-name="reply.author.name"
            :author-id="reply.author_id"
          />
        </template>
        <pagination
          v-model="page"
          :total="total"
          :page-size="size"
          @page-update="to"
        />
      </div>
      <div class="w-full px-4 min-h-60 h-72">
        <comment-editor
          :footer-class="'h-fit'"
          :wrapper-class="'min-h-32 overflow-auto bg-default-100 rounded-md w-full break-words resize-y h-full'"
          main-class="w-full px-0 py-4"
          root-class="w-full h-full flex flex-col bg-background dark:bg-default-200 p-4 rounded-md gap-4"
          @send="onClickSend"
        />
      </div>
    </div>
  </transition-collapse>
</template>

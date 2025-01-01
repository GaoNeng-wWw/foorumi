<script setup lang="ts">
import { useMessage } from '@miraiui-org/vue-message';
import type { ISend } from '~/components/comment-editor/index.vue';

definePageMeta({
  auth: true,
});
const { params: { id } } = useRoute();
const threadListComp = useTemplateRef('threadListRef');
const realId = ref(Number.parseInt(id.toString()));
const onClickSend = (
  { content, success, isEmpty, files }: ISend,
) => {
  if (isEmpty) {
    return success();
  }
  $fetch(
    `/api/threads/${realId.value}`,
    {
      body: {
        postId: realId.value,
        content,
        files,
      },
      method: 'post',
    },
  )
    .then(() => {
      useMessage({
        // TODO: I18N
        content: '发送成功',
        duration: 2000,
        type: 'success',
      });
      threadListComp.value?.toLast();
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      success();
    });
};
</script>

<template>
  <div
    class="w-full min-h-32 space-y-2"
  >
    <thread-list
      :id="realId"
      ref="threadListRef"
    />
    <client-only>
      <comment-editor
        root-class="bg-default-200 rounded-md mb-4 p-4 flex flex-col gap-4"
        tool-bar-class="w-full flex gap-4 items-center pl-3 h-5"
        footer-class="w-full flex items-center pl-3 !px-2"
        wrapper-class="overflow-auto rounded-md w-full break-words flex-auto bg-default-100 h-64"
        @send="onClickSend"
      />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { useMessage } from '@miraiui-org/vue-message';

definePageMeta({
  auth: true,
});
const { params: { id } } = useRoute();
const realId = ref(Number.parseInt(id.toString()));
const onClickSend = ({ content, success, isEmpty }: { content: string; success: () => void; isEmpty: boolean }) => {
  if (isEmpty) {
    return success();
  }
  $fetch(
    `/api/threads/${realId.value}`,
    {
      body: {
        postId: realId.value,
        content,
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
  <nuxt-layout
    name="side"
    direction="rtl"
    aside-sticky
    aside-external-class="w-32 !hidden"
    layout-root-external-class="gap-2 py-4 z-0"
  >
    <div
      class="w-full min-h-32 space-y-2"
    >
      <thread-list :id="realId" />
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
  </nuxt-layout>
</template>

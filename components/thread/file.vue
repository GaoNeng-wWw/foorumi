<script lang="ts" setup>
import { PaperClipIcon } from '@heroicons/vue/24/solid';

const { hash, rawName } = defineProps<{
  hash: string;
  rawName: string;
}>();
const downloadFile = () => {
  $fetch(`/api/files/${hash}`, {
    method: 'get',
    query: {
      meta: true,
    },
  })
    .then((meta) => {
      $fetch(
        `/api/files/${hash}`,
        {
          method: 'get',
        },
      )
        .then((blob: unknown) => {
          const _blob = blob as Blob;
          const file = new File([_blob], meta.rawName, { type: meta.mime });
          const url = URL.createObjectURL(file);
          const link = document.createElement('a');
          link.href = url;
          link.download = meta.rawName;
          link.click();
        });
    });
};
</script>

<template>
  <div
    class="
    w-fit p-2 rounded flex gap-2 text-tiny
    "
  >
    <paper-clip-icon
      class="size-4 shrink-0 grow-0 basis-auto mt-0.5"
    />
    <div class="flex-auto line-clamp-1 flex gap-2 justify-end font-sans">
      <span :title="rawName">{{ rawName }}</span>
      <span
        class="cursor-pointer mt-px"
        @click="downloadFile"
      >下载</span>
    </div>
  </div>
</template>

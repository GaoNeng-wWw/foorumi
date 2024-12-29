<script lang="ts" setup>
import { PaperClipIcon, PlusIcon } from '@heroicons/vue/24/solid';
import { Icon } from '@iconify/vue';

const { name, type = 'pending' } = defineProps<{
  name: string;
  type: 'pending' | 'uploading' | 'success' | 'fail';
}>();
const emits = defineEmits<{
  close: [string];
}>();
const handleDelete = () => {
  emits('close', name);
};
</script>

<template>
  <div
    :data-type="type"
    class="
    w-fit p-2 rounded flex items-center gap-2
    data-[type=success]:bg-primary data-[type=success]:text-primary-foreground
    data-[type=pending]:bg-default data-[type=pending]:text-default-foreground
    data-[type=fail]:bg-danger data-[type=fail]:text-danger-foreground
    data-[type=uploading]:bg-default data-[type=uploading]:text-default-foreground
    "
  >
    <paper-clip-icon
      v-if="type!=='uploading'"
      class="size-4 shrink-0 grow-0 basis-auto"
    />
    <Icon
      v-else
      icon="line-md:loading-loop"
      width="16"
      height="16"
    />
    <div class="flex-auto line-clamp-1">
      <span :title="name">{{ name }}</span>
    </div>
    <plus-icon
      class="size-5 shrink-0 grow-0 basis-auto rotate-45 cursor-pointer"
      @click="handleDelete"
    />
  </div>
</template>

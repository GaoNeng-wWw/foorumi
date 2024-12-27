<script lang="ts" setup>
import { PaperClipIcon, PlusIcon } from '@heroicons/vue/24/solid';

const { name } = defineProps<{
  name: string;
}>();
const emits = defineEmits<{
  close: [string];
}>();
const handleDelete = () => {
  emits('close', name);
};
</script>

<template>
  <div class="w-fit p-2 rounded bg-primary flex items-center gap-2 text-primary-foreground">
    <paper-clip-icon class="size-4 shrink-0 grow-0 basis-auto" />
    <div class="flex-auto line-clamp-1">
      <span :title="name">{{ name }}</span>
    </div>
    <plus-icon
      class="size-5 shrink-0 grow-0 basis-auto rotate-45 cursor-pointer"
      @click="handleDelete"
    />
  </div>
</template>

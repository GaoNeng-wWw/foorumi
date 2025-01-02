<script lang="ts" setup>
const { authorName, authorId, authorAvatar } = defineProps<{
  authorAvatar?: string;
  authorName?: string;
  authorId?: number;
  avatarClass?: string;
}>();
</script>

<template>
  <div
    class="flex flex-col items-center gap-4 py-4 bg-default-300 border-b border-default-400"
  >
    <img
      :src="authorAvatar"
      :loading="'lazy'"
      class="size-8"
    >
    <nuxt-link :to="`/user/${authorId}`">
      {{ authorName }}
    </nuxt-link>
  </div>
</template>

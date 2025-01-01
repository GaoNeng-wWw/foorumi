<script lang="ts" setup>
const { authorName, authorId, authorAvatar } = defineProps<{
  avatarUrl?: string;
  authorName?: string;
  authorId?: number;
  authorAvatar?: string;
}>();
</script>

<template>
  <div
    class="flex flex-col items-center gap-4 py-4 bg-default-300 border-b border-default-400"
  >
    <img
      :src="authorAvatar"
      :loading="'lazy'"
      class="size-24 mx-auto"
    >
    <!-- <div class="size-24 mx-auto bg-default-100" /> -->
    <nuxt-link :to="`/user/${authorId}`">
      {{ authorName }}
    </nuxt-link>
  </div>
</template>

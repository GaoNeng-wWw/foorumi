<script lang="ts" setup>
const { authorName, authorId } = defineProps<{
  avatarUrl?: string;
  authorName?: string;
  authorId?: number;
}>();
</script>

<template>
  <div
    class="flex flex-col items-center gap-4 py-4 bg-default-300 border-b border-default-400"
  >
    <div class="size-24 mx-auto bg-default-100" />
    <nuxt-link :to="`/user/${authorId}`">
      {{ authorName }}
    </nuxt-link>
  </div>
</template>

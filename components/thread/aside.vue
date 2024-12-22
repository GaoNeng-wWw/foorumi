<script lang="ts" setup>
const { authorName, authorId } = defineProps<{
  avatarUrl?: string;
  authorName?: string;
  authorId?: number;
}>();
</script>

<template>
  <thread-author
    :author-name="authorName"
    :author-id="authorId"
  />
</template>

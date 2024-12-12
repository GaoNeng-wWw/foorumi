<script lang="ts" setup>
const { leaf = true, content = '', authorName, authorId } = defineProps<{
  leaf?: boolean;
  content?: string;
  authorName?: string;
  authorId?: number;
}>();
</script>

<template>
  <div
    :data-leaf="leaf"
    class="w-full data-[leaf=false]:grid data-[leaf=false]grid-cols-[40px_minmax(0,1fr)] data-[leaf=false]gap-2"
  >
    <div class="w-full space-y-2">
      <div class=" grid grid-cols-[40px_minmax(0,1fr)] items-center gap-2">
        <div class="size-10 shrink-0 bg-red-500" />
        <nuxt-link :to="`/user/${authorId}`">
          <p class=" font-bold">
            {{ authorName }}
          </p>
        </nuxt-link>
      </div>
      <div class="space-y-2 grid grid-cols-[40px_minmax(0,1fr)] gap-2">
        <div v-html="content" />
      </div>
      <div class="mt-2 grid grid-cols-[40px_minmax(0,1fr)] gap-2">
        <div>
          <span class=" dark:text-blue-400 text-blue-500 cursor-pointer">回复</span>
        </div>
      </div>
      <div class="grid grid-cols-[40px_minmax(0,1fr)] gap-2">
        <div />
        <!-- Children -->
      </div>
    </div>
  </div>
</template>

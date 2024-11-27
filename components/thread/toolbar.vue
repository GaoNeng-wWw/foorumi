<script lang="ts" setup>
const showReply = defineModel<boolean>();
</script>

<template>
  <div class="w-full mt-2 flex">
    <div class="ml-auto space-x-4">
      <span>举报</span>
      <div class="space-x-2 inline-block">
        <span>#1</span>
        <span
          class="cursor-pointer"
          @click="showReply = !showReply"
        >回复</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { TransitionCollapse } from '@miraiui-org/vue-transition-collapse';

const { show = false } = defineProps<{
  show?: boolean;
}>();
</script>

<template>
  <transition-collapse>
    <div
      v-if="show"
      class="w-full bg-default-200 border border-default-100 rounded-md mt-2"
    >
      <div class="p-4 space-y-4">
        <reply-item />
        <!-- <reply-item />
        <reply-item />
        <reply-item />
        <reply-item /> -->
      </div>
    </div>
  </transition-collapse>
</template>

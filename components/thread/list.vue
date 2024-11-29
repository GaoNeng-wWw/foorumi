<script lang="ts" setup>
import { ChevronLeftIcon } from '@heroicons/vue/24/solid';
</script>

<template>
  <div class="w-full rounded-md">
    <thread-item
      show-header
    >
      <template #title-prefix>
        <ghost-button @click="() => $router.back()">
          <chevron-left-icon class="size-6 flex-shrink-0" />
        </ghost-button>
      </template>
    </thread-item>
    <thread-item>
      <template #title-prefix>
        <ghost-button @click="() => $router.back()">
          <chevron-left-icon class="size-6 flex-shrink-0" />
        </ghost-button>
      </template>
    </thread-item>
    <div class="px-4" />
  </div>
</template>

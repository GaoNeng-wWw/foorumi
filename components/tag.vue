<template>
  <div class="text-sm px-2 py-1 rounded-md border border-default-400 bg-default-200 text-foreground">
    {{ value }}
  </div>
</template>

<script lang="ts" setup>
const { value = '' } = defineProps<{
  value?: string | number | boolean;
}>();
</script>

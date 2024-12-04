<script lang="ts" setup>
const {
  upClass = '',
  downClass = '',
} = defineProps<{
  upClass?: string;
  downClass?: string;
}>();
</script>

<template>
  <div class="w-fit flex flex-col">
    <icon-chevron-up :class="[upClass, '-mb-2']" />
    <icon-chevron-down :class="[downClass]" />
  </div>
</template>

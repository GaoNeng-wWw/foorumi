<script lang="ts" setup>
const { direction = 'ltr', aisdeSticky = false } = defineProps<{
  direction?: 'rtl' | 'ltr';
  aisdeSticky?: boolean;
}>();
</script>

<template>
  <div
    class="flex w-full gap-4"
    :class="{
      'flex-row-reverse': direction === 'rtl',
    }"
  >
    <section class=" flex-grow flex-shrink">
      <slot />
    </section>
    <aside
      class="shrink-0 w-40 h-full grow-0 basis-auto hidden sm:block"
      :class="{
        'sticky top-20': aisdeSticky,
      }"
    >
      <slot name="aside" />
    </aside>
  </div>
</template>

<script lang="ts" setup>
const { direction = 'ltr', asideSticky = false, asideExternalClass = '', layoutRootExternalClass = '' } = defineProps<{
  direction?: 'rtl' | 'ltr';
  asideSticky?: boolean;
  asideExternalClass?: string;
  layoutRootExternalClass?: string;
}>();
</script>

<template>
  <div
    class="flex w-full gap-4"
    :class="{
      'flex-row-reverse': direction === 'rtl',
      [layoutRootExternalClass]: true,
    }"
  >
    <section class="flex-grow flex-shrink">
      <slot />
    </section>
    <aside
      class="shrink-0 w-40 h-full grow-0 basis-auto hidden sm:block"
      :class="{
        'sticky top-20': asideSticky,
        [asideExternalClass]: true,
      }"
    >
      <slot name="aside" />
    </aside>
  </div>
</template>

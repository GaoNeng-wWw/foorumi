<script setup lang="ts">
const { header = false } = defineProps<{
  header?: boolean;
  headerExtraClass?: string;
  headerFixed?: boolean;
  footer?: boolean;
  footerExtraClass?: string;
  mainExtraClass?: string;
  rootExtraClass?: string;
}>();
</script>

<template>
  <div class="flex flex-col h-full">
    <header
      v-if="header"
      class="flex h-16 w-full bg-background dark:bg-default-200 dark:shadow-none shadow sticky top-0 left-0 z-10 px-4"
    >
      <slot name="header" />
    </header>
    <main class="px-0 sm:px-4 h-full overflow-auto">
      <slot />
    </main>
    <!-- <footer
      v-if="footer"
    >
      <slot name="footer" />
    </footer> -->
  </div>
</template>

<style scoped></style>

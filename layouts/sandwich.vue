<script setup lang="ts">
const { header = false, footer = false, headerExtraClass = '', footerExtraClass = '', mainExtraClass = '', rootExtraClass = '', headerFixed = false } = defineProps<{
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
  <div
    :class="[
      'w-full h-full p-4 flex flex-col',
      ...rootExtraClass,
    ]"
  >
    <header
      v-if="header"
      :class="['flex h-16 w-full bg-background dark:bg-default-200 dark:shadow-none shadow', headerExtraClass, { 'fixed top-0 left-0 p-4': headerFixed }]"
    >
      <slot name="header" />
    </header>
    <main :class="['flex-grow pt-12 pb-4', mainExtraClass]">
      <!-- <div class="w-full h-full bg-red-500" /> -->
      <slot />
    </main>
    <footer
      v-if="footer"
      :class="[footerExtraClass]"
    >
      <slot name="footer" />
    </footer>
  </div>
</template>

<style scoped></style>

<script setup lang="ts">
definePageMeta({
  auth: true,
});
</script>

<template>
  <nuxt-layout
    name="side"
    direction="rtl"
    aside-sticky
    aside-external-class="w-32 sm:hidden"
    layout-root-external-class="gap-2 py-4 relative z-0"
  >
    <template
      #aside
    >
      <div class="w-full flex flex-col items-center gap-2">
        <div class="w-full aspect-square bg-red-500" />
        <div class="w-fit">
          <nuxt-link class="hover:text-primary-500 cursor-pointer transition">
            Author Name
          </nuxt-link>
        </div>
      </div>
    </template>
    <thread-list />
  </nuxt-layout>
</template>

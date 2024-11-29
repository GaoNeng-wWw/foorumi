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
    layout-root-external-class="gap-2 py-4 z-0"
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
    <div
      class="w-full min-h-full space-y-2"
    >
      <thread-list />
      <pagination
        :total-item="100"
        :page-size="10"
      />
      <client-only>
        <comment-editor />
      </client-only>
    </div>
  </nuxt-layout>
</template>

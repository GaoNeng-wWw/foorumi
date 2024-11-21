<script lang="ts" setup>
const { data } = useFetch<SiteMeta>('/api/site', { method: 'get', pick: ['siteName'], cache: 'reload' });
</script>

<template>
  <NuxtLayout
    name="sandwich"
    header
    footer
    header-fixed
  >
    <template #header>
      <nav class="h-full max-w-4xl w-full flex items-center justify-between mx-auto">
        <nuxt-link :href="'/'">
          {{ data?.siteName }}
        </nuxt-link>
        <div class=" items-center gap-2 hidden sm:flex">
          <color-switch />
        </div>
      </nav>
    </template>
    <section class="max-w-4xl w-full mx-auto h-full">
      <nuxt-page />
    </section>
    <template #footer>
      <div class="max-w-4xl w-full mx-auto text-center">
        footer
      </div>
    </template>
  </NuxtLayout>
</template>

<style scoped></style>

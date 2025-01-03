<script lang="ts" setup>
const appState = useState<AppState>('appState');
</script>

<template>
  <NuxtLayout
    name="sandwich"
    header
    footer
    header-fixed
    header-extra-class="z-10"
    vaul-drawer-wrapper
  >
    <template #header>
      <navbar />
    </template>
    <section class="max-w-7xl w-full h-full mx-auto">
      <nuxt-page />
    </section>
    <template #footer>
      <div class="max-w-6xl w-full mx-auto text-center">
        footer
      </div>
    </template>
    <app-drawer
      v-model="appState.drawer"
      direction="left"
      width="320px"
      should-scale-background
    >
      <div class="w-full h-full">
        <app-side class="w-full px-4" />
      </div>
    </app-drawer>
  </NuxtLayout>
</template>

<style scoped></style>

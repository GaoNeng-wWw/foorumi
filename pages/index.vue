<script lang="ts" setup>
import { Bars3Icon } from '@heroicons/vue/24/solid';

const { data } = useFetch<SiteMeta>('/api/site', { method: 'get', pick: ['siteName'], cache: 'reload' });
const appState = useState<AppState>('appState');
</script>

<template>
  <NuxtLayout
    name="sandwich"
    header
    footer
    header-fixed
    header-extra-class="z-10"
  >
    <template #header>
      <nav class="h-full max-w-6xl w-full flex items-center justify-between mx-auto">
        <div class="flex items-center gap-4">
          <ghost-button
            class="!p-1 block md:hidden"
            @click="() => appState.drawer = !appState.drawer"
          >
            <bars3-icon class="w-6" />
          </ghost-button>
          <nuxt-link :href="'/'">
            {{ data?.siteName }}
          </nuxt-link>
        </div>
        <div class=" items-center gap-2 hidden sm:flex">
          <color-switch />
        </div>
      </nav>
    </template>
    <section class="max-w-7xl w-full mx-auto h-full">
      <nuxt-page />
    </section>
    <template #footer>
      <div class="max-w-6xl w-full mx-auto text-center">
        footer
      </div>
    </template>
  </NuxtLayout>
</template>

<style scoped></style>

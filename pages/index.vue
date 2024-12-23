<script lang="ts" setup>
import { Bars3Icon } from '@heroicons/vue/24/solid';

const { data } = useFetch<SiteMeta>('/api/site', { method: 'get', pick: ['siteName'], cache: 'reload' });
const appState = useState<AppState>('appState');
const route = useRoute();
const openDrawer = () => {
  appState.value.drawer = !appState.value.drawer;
};
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
    <section class="max-w-7xl w-full mx-auto">
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
      default-size="50vw"
    >
      <div class="w-full h-full">
        <app-side class="w-full px-4" />
      </div>
    </app-drawer>
  </NuxtLayout>
</template>

<style scoped></style>

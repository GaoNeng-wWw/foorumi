<script lang="ts" setup>
import type { SideBarData } from '~/components/admin/side-bar.vue';

const data = [
  {
    label: '区域管理',
    link: '/admin/area',
  },
] as SideBarData[];
</script>

<template>
  <nuxt-layout name="full-aside">
    <template #aside>
      <admin-side-bar :data="data" />
    </template>
    <div class="py-3 h-full">
      <div class="h-full pr-2">
        <div class="w-full h-full">
          <nuxt-page />
        </div>
      </div>
    </div>
  </nuxt-layout>
</template>

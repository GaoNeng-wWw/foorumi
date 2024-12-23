<script lang="ts" setup>
const router = useRouter();
const area = computed(() => router.currentRoute.value.query.area?.toString());

definePageMeta({
  auth: true,
  drawer: {
    component: '@/components/AppSide/index.vue',
  },
});
</script>

<template>
  <div class="w-full h-full p-4 flex">
    <div class="hidden md:block flex-shrink-0 flex-grow-0 min-w-48 py-9">
      <app-side />
    </div>
    <div class="flex-grow transition">
      <post-list :area="area" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const siteMeta = useState('siteMeta');
await callOnce(async () => {
  siteMeta.value = await $fetch('/api/site', { method: 'get' });
});
</script>

<template>
  <div class="w-full h-screen bg-default-100 overflow-auto">
    <nuxt-page />
  </div>
</template>

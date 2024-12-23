<script lang="ts" setup>
const siteMeta = useState('siteMeta');
useState('appState', () => ({
  drawer: false,
}));
const { loggedIn } = useUserSession();
await callOnce(async () => {
  siteMeta.value = await $fetch('/api/site', { method: 'get' });
  if (!loggedIn.value) {
    return;
  }
});
</script>

<template>
  <div class="w-full h-full bg-default-100 overflow-auto">
    <nuxt-page />
  </div>
</template>

<style>
html,body,#__nuxt {
  width: 100%;
  min-height: 100%;
  height: 100% !important;
  padding: 0;
  margin: 0;
}
</style>

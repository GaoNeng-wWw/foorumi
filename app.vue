<script lang="ts" setup>
import type { Profile } from '@prisma/client';
import { PERMISSIONS, PROFILE } from './lib/constant';

const siteMeta = useState('siteMeta');
const { loggedIn } = useUserSession();
const { data, execute } = useFetch('/api/profile', { immediate: false, method: 'get' });
useState<Pick<Profile, 'name' | 'bio'> | null>(PROFILE, () => {
  return computed(() => {
    return data.value;
  });
});

useState(PERMISSIONS, () => {
  return computed(() => {
    return data.value?.role
      .flatMap(role => role.permission)
      .map(permission => ({ ...permission }));
  });
});

await callOnce(async () => {
  siteMeta.value = await $fetch('/api/site', { method: 'get' });
  if (!loggedIn.value) {
    return;
  }
  execute();
});
</script>

<template>
  <div class="w-full h-screen bg-default-100 overflow-auto">
    <nuxt-page />
  </div>
</template>

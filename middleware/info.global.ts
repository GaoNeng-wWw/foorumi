import { usePermissionStore, useProfile } from '~/composables/store';

export default defineNuxtRouteMiddleware((to) => {
  if (to.path.includes('/auth') || to.path.includes('/setup')) {
    return;
  }
  const { data } = useFetch<MininalProfile>('/api/profile', { method: 'get', server: false });
  const profile = useProfile();
  const permission = usePermissionStore();
  watch(data, () => {
    if (!data.value) {
      permission.value = [];
      return;
    }
    profile.value = data.value;
    permission.value = data.value?.role
      .flatMap(role => role.permission)
      .map(permission => ({ ...permission }));
  }, { immediate: true, deep: true });
});

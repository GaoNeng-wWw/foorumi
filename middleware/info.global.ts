import { PERMISSIONS, PROFILE } from '~/lib/constant';

export default defineNuxtRouteMiddleware((to) => {
  if (to.path.includes('/auth') || to.path.includes('/setup')) {
    return;
  }
  if (
    useState(PROFILE).value || useState(PERMISSIONS).value
  ) {
    return;
  }
  const { data } = useFetch<MininalProfile>('/api/profile', { method: 'get', server: false });
  useState<MininalProfile | null>(PROFILE, () => data);

  useState(PERMISSIONS, () => {
    return computed(() => {
      if (!data.value) {
        return [];
      }
      return data.value?.role
        .flatMap(role => role.permission)
        .map(permission => ({ ...permission }));
    });
  });
});

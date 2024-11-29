import type { Profile } from '@prisma/client';
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
  const { data } = useFetch('/api/profile', { method: 'get' });
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
});

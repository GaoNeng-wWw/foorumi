import type { Permission } from '@prisma/client';
import type { DirectiveBinding } from 'vue';
import { PERMISSIONS } from '~/lib/constant';

export default defineNuxtPlugin((nuxtApp) => {
  const visible = (requiredPermission: string) => {
    const permissions = useState<Permission[]>(PERMISSIONS);
    if (!permissions.value) {
      return false;
    }
    return permissions.value.some(permission => permission.name === requiredPermission) || permissions.value.some(permission => permission.name === '*');
  };
  nuxtApp.vueApp.directive('permission', {
    beforeMount(el) {
      el.style.oldDisplay = el.style.display;
      el.style.display = 'none';
    },
    mounted(el, { value }) {
      el.style.display = visible(value) ? el.style.oldDisplay : 'none';
    },
    updated(el, { value }) {
      el.style.display = visible(value) ? el.style.oldDisplay : 'none';
    },
    getSSRProps(binding: DirectiveBinding<string>) {
      return {
        style: {
          display: visible(binding.value) ? undefined : 'none',
        },
      };
    },
  });
});

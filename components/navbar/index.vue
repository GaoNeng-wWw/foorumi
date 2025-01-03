<script lang="ts" setup>
import { UserIcon } from '@heroicons/vue/24/outline';
import { Bars3Icon } from '@heroicons/vue/24/solid';
import { useProfile } from '~/composables/store';

const { data } = useFetch<SiteMeta>('/api/site', { method: 'get', pick: ['siteName'], cache: 'reload' });
const appState = useState<AppState>('appState');

const router = useRouter();
const { clear } = useUserSession();
const profile = useProfile();
const logout = () => {
  clear()
    .then(() => {
      router.go(0);
    });
};
const openDrawer = () => {
  appState.value.drawer = !appState.value.drawer;
};
</script>

<template>
  <nav class="h-full max-w-6xl w-full flex items-center justify-between mx-auto">
    <div class="flex items-center gap-4">
      <ghost-button
        class="!p-1 block md:hidden"
        @click="openDrawer"
      >
        <bars3-icon class="w-6" />
      </ghost-button>
      <nuxt-link :href="'/'">
        {{ data?.siteName }}
      </nuxt-link>
    </div>
    <div class="items-center gap-2 flex">
      <auth-state>
        <template #default="{ user }">
          <tooltip-provider
            v-if="user && profile"
          >
            <tooltip-root>
              <tooltip-trigger class="hidden md:block">
                <nuxt-link
                  :to="`/user/${user.id}`"
                  prefetch
                >
                  <app-avatar
                    :id="user.id"
                    :size="'xs'"
                    :rounded="'full'"
                    class="cursor-pointer"
                  />
                </nuxt-link>
              </tooltip-trigger>
              <tooltip-content
                :side-offset="8"
                class="hidden md:block"
              >
                <div class="p-4 rounded bg-default space-y-2">
                  <div class="text-center">
                    {{ profile?.name }}
                  </div>
                  <div class="w-full">
                    <nuxt-link :to="`/user/${user.id}`">
                      <div class="flex cursor-pointer gap-2 items-center justify-center hover:bg-default-200 p-2 rounded">
                        <user-icon class="w-6 h-6" />
                        个人空间
                      </div>
                    </nuxt-link>
                    <div class="w-fit mx-auto">
                      <ghost-button
                        class="hover:!bg-default-200"
                        @click="logout"
                      >
                        退出登录
                      </ghost-button>
                    </div>
                  </div>
                </div>
              </tooltip-content>
            </tooltip-root>
          </tooltip-provider>
        </template>
      </auth-state>
      <color-switch />
    </div>
  </nav>
</template>

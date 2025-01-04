<script lang="ts" setup>
import { vOnClickOutside } from '@vueuse/components';
import { Button as MButton } from '@miraiui-org/vue-button';
import type { TreeData } from '~/components/tree/index.vue';
import { useProfile } from '~/composables/store';

const { treeData } = useAreaTree();
const router = useRouter();
const area = computed(() => router.currentRoute.value.query.area?.toString());
const defaultSelect = computed(() => area.value ? [area.value] : []);
const isFullscreen = ref(false);
const showEditor = ref(false);
const editModalVisibility = ref(false);
const profile = useProfile();
const { clear } = useUserSession();
const onClickNode = ([node]: TreeData[]) => {
  if (!node) {
    router.replace({
      query: {},
    });
    return;
  }
  router.replace({
    path: '/',
    query: {
      area: node.id,
    },
  });
};
const show = () => {
  if (editModalVisibility.value) {
    return;
  }
  editModalVisibility.value = true;
};
const close = () => {
  document.startViewTransition(() => {
    editModalVisibility.value = false;
    showEditor.value = true;
    isFullscreen.value = false;
  });
};
const minimize = () => {
  showEditor.value = false;
  isFullscreen.value = false;
};
const fullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
  showEditor.value = true;
};
const restoreMinimze = () => {
  showEditor.value = true;
};
const closeEditorModal = (ev: PointerEvent) => {
  let el = ev.target as HTMLElement | null;
  while (el) {
    if (el.dataset['radixPopperContentWrapper'] !== undefined) {
      return;
    }
    el = el.parentElement;
  }
  close();
};
const logout = () => {
  clear()
    .then(() => {
      router.go(0);
    });
};
</script>

<template>
  <div class="w-fit h-fit sticky top-4 space-y-4">
    <m-button
      type="primary"
      @click="show"
    >
      发布帖子
    </m-button>
    <tree
      :data="treeData"
      :default-select="defaultSelect"
      :multiple="false"
      :padding="false"
      @select="onClickNode"
    />
    <div
      v-if="profile"
      class="w-full md:hidden space-y-2"
    >
      <div class="flex gap-4 w-full">
        <div class="shrink-0 w-fit">
          <app-avatar
            :id="profile?.account_id"
            size="xs"
            rounded="full"
          />
        </div>
        <div class="overflow-hidden flex items-center">
          <nuxt-link :to="`/user`">
            <p class="truncate">
              {{ profile.name }}
            </p>
          </nuxt-link>
        </div>
      </div>
      <ghost-button
        class="w-full !text-center"
        @click="logout"
      >
        退出登录
      </ghost-button>
    </div>
    <app-drawer
      v-model="editModalVisibility"
      direction="bottom"
      height="fit-content"
      width="100%"
      transparent
    >
      <div
        :data-fullscreen="isFullscreen"
        :data-minimize="!showEditor && !isFullscreen"
        class="
          group
          dark:bg-default-100 bg-default-100 w-screen h-screen rounded-md transition-all
          data-[fullscreen=false]:max-w-4xl data-[fullscreen=false]:h-fit data-[fullscreen=false]:border
          data-[fullscreen=false]:px-4 data-[fullscreen=false]:border-default
          data-[minimize=true]:bg-opacity-90 z-50 mx-auto
        "
      >
        <app-side-post-editor
          v-on-click-outside="closeEditorModal"
          :show-editor="showEditor"
          :minimize="minimize"
          :fullscreen="fullscreen"
          :restore-minimze="restoreMinimze"
          :close="close"
        />
      </div>
    </app-drawer>
  </div>
</template>

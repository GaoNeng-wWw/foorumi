<script lang="ts" setup>
import { vOnClickOutside } from '@vueuse/components';
import { Button as MButton } from '@miraiui-org/vue-button';
import type { TreeData } from '~/components/tree/index.vue';

const { treeData } = useAreaTree();
const router = useRouter();
const area = computed(() => router.currentRoute.value.query.area?.toString());
const defaultSelect = computed(() => area.value ? [area.value] : []);
const isFullscreen = ref(false);
const showEditor = ref(false);
const editModalVisibility = ref(false);
const onClickNode = ([node]: TreeData[]) => {
  if (!node) {
    router.replace({
      query: {},
    });
    return;
  }
  router.replace({
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

    <app-drawer
      v-model="editModalVisibility"
      direction="bottom"
      default-size="fit-content"
      default-width="100%"
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

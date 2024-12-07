<script lang="ts" setup>
import { Button as MButton } from '@miraiui-org/vue-button';
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/vue/24/solid';
import { vOnClickOutside } from '@vueuse/components';
import postEditor from './component/post-editor.vue';
import type { TreeData } from '~/components/tree/index.vue';

const { treeData } = useAreaTree();
const isFullscreen = ref(false);
const showEditor = ref(true);
const editModalVisibility = ref(false);
const state = useState<AppState>('appState');

const show = () => {
  if (editModalVisibility.value) {
    return;
  }
  editModalVisibility.value = true;
};
const close = () => {
  editModalVisibility.value = false;
  showEditor.value = true;
  isFullscreen.value = false;
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

const area: Ref<string | undefined> = ref();

const filterPostList = ([node]: TreeData<{
  [x: string]: unknown;
}>[]) => {
  if (!node) {
    area.value = '';
    return;
  }
  area.value = node.id;
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

definePageMeta({
  auth: true,
});
</script>

<template>
  <nuxt-layout
    name="side"
    aside-sticky
    direction="rtl"
  >
    <div class="w-full h-full">
      <post-list :area="area" />
    </div>
    <teleport
      v-if="editModalVisibility"
      to="body"
    >
      <div
        :data-fullscreen="isFullscreen"
        :data-minimize="!showEditor && !isFullscreen"
        class="
          group
          fixed top-0 left-0 dark:bg-default-100 bg-default-100 w-screen h-screen rounded-md
          data-[fullscreen=false]:max-w-4xl data-[fullscreen=false]:h-fit data-[fullscreen=false]:border
          data-[fullscreen=false]:px-4 data-[fullscreen=false]:border-default
          data-[fullscreen=false]:left-1/2 data-[fullscreen=false]:-translate-x-1/2
          data-[fullscreen=false]:top-full data-[fullscreen=false]:-translate-y-full
          data-[minimize=true]:bg-opacity-90 z-50
        "
      >
        <post-editor
          v-on-click-outside="closeEditorModal"
          :show-editor="showEditor"
          :minimize="minimize"
          :fullscreen="fullscreen"
          :restore-minimze="restoreMinimze"
          :close="close"
        />
      </div>
    </teleport>
    <template
      #aside
    >
      <div class="py-4 flex flex-col gap-4">
        <div class="flex items-center">
          <m-button
            :type="'primary'"
            @click="show"
          >
            发布帖子
          </m-button>
          <ghost-button
            v-if="state.drawer"
            class="!p-1 ml-auto mr-0 hover:!bg-default"
            @click="state.drawer = false"
          >
            <arrow-left-start-on-rectangle-icon class="size-5" />
          </ghost-button>
        </div>
        <div class="opacity-80 hover:opacity-100 transition duration-normal">
          <tree
            :data="treeData"
            :multiple="false"
            :padding="false"
            @select="filterPostList"
          />
        </div>
      </div>
    </template>
  </nuxt-layout>
</template>

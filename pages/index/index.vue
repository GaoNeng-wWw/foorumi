<script lang="ts" setup>
import { Button as MButton } from '@miraiui-org/vue-button';
import postEditor from './component/post-editor.vue';

const { treeData } = useAreaTree();
const isFullscreen = ref(false);
const showEditor = ref(true);
const editModalVisibility = ref(false);

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
      <post-list />
    </div>
    <teleport
      v-if="editModalVisibility"
      to="body"
      :disabled="!isFullscreen"
    >
      <div
        :data-fullscreen="isFullscreen"
        :data-minimize="!showEditor && !isFullscreen"
        class="
          transition group
          fixed top-0 left-0 dark:bg-default-100 bg-default-100 w-screen h-screen z-30 rounded-md
          data-[fullscreen=false]:max-w-4xl data-[fullscreen=false]:h-fit data-[fullscreen=false]:border
          data-[fullscreen=false]:px-4 data-[fullscreen=false]:border-default
          data-[fullscreen=false]:left-1/2 data-[fullscreen=false]:-translate-x-1/2
          data-[fullscreen=false]:top-full data-[fullscreen=false]:-translate-y-full
          data-[minimize=true]:bg-opacity-90
        "
      >
        <post-editor
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
        <div>
          <m-button
            :type="'primary'"
            @click="show"
          >
            发布帖子
          </m-button>
        </div>
        <div class="opacity-80 hover:opacity-100 transition duration-normal">
          <tree-context>
            <tree
              :data="treeData"
            />
          </tree-context>
        </div>
      </div>
    </template>
  </nuxt-layout>
</template>

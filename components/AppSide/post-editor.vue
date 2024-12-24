<script lang="ts" setup>
import { ArrowsPointingOutIcon, MinusIcon, XMarkIcon } from '@heroicons/vue/24/solid';
import { useMessage } from '@miraiui-org/vue-message';
import type { TreeSelectData } from '~/components/AppTreeSelect/index.vue';

const postTitle = ref('');
const canPost = ref(true);
const titleErrMessage = ref('');
const { treeSelectData } = useAreaTree();
const sendTo = ref<TreeSelectData<string> | null>();
// TODO:I18N
const areaSelectLabel = computed(() => sendTo.value?.label ?? '点此选择发布到的区块');

const props = withDefaults(
  defineProps<{
    showEditor: boolean;
    minimize?: () => void;
    fullscreen?: () => void;
    restoreMinimze?: () => void;
    close?: () => void;
  }>(),
  {
    showEditor: true,
  },
);

const onSend = ({ content, success }: { content: string; success: () => void }) => {
  if (!postTitle.value.length) {
    canPost.value = false;
    titleErrMessage.value = '帖子名不能为空';
    success();
    return;
  }
  if (!sendTo.value || !sendTo.value.value) {
    canPost.value = false;
    titleErrMessage.value = '您必须选择一个要发布到的版块';
    success();
    return;
  }
  canPost.value = true;
  titleErrMessage.value = '';
  $fetch('/api/posts', {
    body: {
      title: postTitle.value,
      content: content,
      area_id: sendTo.value.value,
    },
    method: 'post',
  })
    .then(() => {
      useMessage({
        content: '发布成功',
      });
    })
    .catch((err) => {
      useMessage({
        type: 'danger',
        content: err.data.message,
      });
    })
    .finally(() => {
      success();
    });
};
</script>

<template>
  <div
    class="max-w-xl h-full mx-auto flex flex-col py-4 transition-all"
    @click.stop="props.restoreMinimze"
  >
    <div class="w-fit h-8 ml-auto mr-0 flex gap-2">
      <ghost-button
        class="!p-1"
        alt="最小化"
        title="最小化"
        @click.stop="props.minimize"
      >
        <minus-icon class="size-5" />
      </ghost-button>
      <ghost-button
        class="!p-1"
        alt="最大化"
        title="最大化"
        @click.stop="fullscreen"
      >
        <arrows-pointing-out-icon class="size-5" />
      </ghost-button>
      <ghost-button
        class="!p-1"
        alt="关闭"
        title="关闭"
        @click.stop="close"
      >
        <x-mark-icon class="size-5" />
      </ghost-button>
    </div>
    <div class="w-full h-[calc(100%_-_2rem)] flex flex-col flex-auto gap-2">
      <div class="h-16 shrink-0">
        <label>
          <base-input
            v-model="postTitle"
            class="mt-2"
            placeholder="请输入帖子标题"
            :err="!canPost"
            :error-message="titleErrMessage"
            desc-class="px-3"
            @input="canPost = postTitle.length > 0 ? Boolean(postTitle) : true"
          >
            <template #prefix>
              <app-tree-select
                v-model:node="sendTo"
                :data="treeSelectData"
                align="start"
                class="!z-[1000] mt-2 hidden sm:block"
              >
                <template #trigger>
                  <button class="text-sm leading-none p-2 outline-0 hidden sm:block">
                    {{ areaSelectLabel }}
                  </button>
                </template>
              </app-tree-select>
            </template>
          </base-input>
        </label>
      </div>
      <app-tree-select
        v-model:node="sendTo"
        :data="treeSelectData"
        align="start"
        class="!z-[1000] mt-2 block sm:hidden"
      >
        <template #trigger>
          <button class="text-sm leading-none p-2 outline-0 block sm:hidden">
            {{ areaSelectLabel }}
          </button>
        </template>
      </app-tree-select>
      <div
        :data-show="props.showEditor"
        class="group w-full h-full grow flex flex-col overflow-hidden data-[show=false]:invisible data-[show=true]:visible"
      >
        <comment-editor
          v-show="props.showEditor"
          class="!px-0"
          root-class="bg-transparent flex flex-col gap-4 group-data-[fullscreen=false]:h-64 group-data-[fullscreen=true]:h-full"
          tool-bar-class="w-full flex gap-4 items-center pl-3 h-5"
          footer-class="w-full flex items-center pl-3"
          wrapper-class="min-h-auto overflow-auto rounded-md w-full break-words flex-auto"
          placeholder="Placeholder"
          @send="onSend"
        />
      </div>
    </div>
  </div>
</template>

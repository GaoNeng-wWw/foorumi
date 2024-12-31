<script lang="ts" setup>
import { BoldIcon, ItalicIcon, ArrowUturnDownIcon, PaperAirplaneIcon, PaperClipIcon } from '@heroicons/vue/24/solid';
import { Button } from '@miraiui-org/vue-button';
import { ImageDropAndPaste } from '~/quill-modules/DropAndPasteUploadImage';
import 'quill/dist/quill.bubble.css';
import 'quill/dist/quill.core.css';
import type ImageData from '~/quill-modules/image-data';

const props = withDefaults(
  defineProps<{
    rootClass?: string;
    toolBarClass?: string;
    wrapperClass?: string;
    inputClass?: string;
    footerClass?: string;
    placeholder?: string;
    mainClass?: string;
  }>(),
  {
    rootClass: '',
    toolBarClass: '',
    wrapperClass: '',
    inputClass: '',
    footerClass: '',
    placeholder: '',
    mainClass: '',
  },
);

let Quill: typeof import('quill').default;
if (import.meta.client) {
  Quill = (await import('quill')).default;
  Quill.register('modules/imageDropAndPasteUpload', ImageDropAndPaste);
}
const editor = useTemplateRef('editor');
const canUndo = ref(false);
let quill: import('quill').default;
const fileList = useTemplateRef('fileList');
const fileSelect = useTemplateRef('fileSelect');

const handleImageUpload = (dataurl: string, _: string, file: ImageData) => {
  const oldIndex = quill.getSelection();
  fetch(dataurl)
    .then(resp => resp.blob())
    .then((blob) => {
      const formData = new FormData();
      formData.set(file.name, blob);
      return $fetch(
        '/api/threads/image',
        {
          method: 'put',
          body: formData,
          query: {},
        },
      )
        .then(paths => paths);
    })
    .then((paths) => {
      paths.forEach((path) => {
        if (path.status === 'success') {
          return quill.insertEmbed(oldIndex?.index ?? 0, 'image', path.url);
        }
      });
    });
};

onMounted(() => {
  if (!editor.value || !import.meta.client) {
    return;
  }
  const el = editor.value;
  quill = new Quill(el, {
    modules: {
      toolbar: {
        container: '#toolbar',
      },
      history: {
        delay: 2000,
        maxStack: 500,
        userOnly: true,
      },
      imageDropAndPasteUpload: {
        handler: handleImageUpload,
      },
    },
    placeholder: props.placeholder,
  });
  quill.on('editor-change', () => {
    canUndo.value = Boolean(quill.history.stack.undo.length);
  });
});

const buttonState = ref<'pending' | 'loading'>('pending');

const setButtoonStateToPending = () => {
  buttonState.value = 'pending';
};

export type ISend = {
  content: string;
  success: () => void;
  isEmpty: boolean;
  files: {
    rawName: string;
    hash: string;
  }[];
};

const emit = defineEmits<{
  send: [ISend];
  undo: [];
}>();
const undo = () => {
  quill.history.undo();
  emit('undo');
};
const onClickSend = () => {
  buttonState.value = 'loading';
  const isEmpty = quill.getContents().length() === 1;
  const content = quill.getSemanticHTML();
  const success = setButtoonStateToPending;
  const files = fileList.value?.getFiles()
    .filter(file => file.hash?.length && file.status === 'success')
    .map((file) => {
      return {
        rawName: file.name,
        hash: file.hash!,
      };
    }) ?? [];
  emit('send', { isEmpty, content, success, files });
};
const uploadFile = () => {
  fileSelect.value?.click();
};
const onFileChange = () => {
  if (!fileSelect.value?.files) {
    return;
  }
  Array.from(fileSelect.value.files)
    .forEach((file) => {
      fileList.value?.addFile(file);
    });
  fileSelect.value.value = '';
};
</script>

<template>
  <div :class="[props.mainClass ? props.mainClass : 'w-full h-full px-4 py-2']">
    <div
      :class="[
        !props.rootClass ? 'w-full h-full flex flex-col bg-background dark:bg-default-200 p-4 rounded-md gap-4' : props.rootClass,
      ]"
    >
      <div
        id="toolbar"
        :class="[
          props.toolBarClass ? props.toolBarClass : 'w-full flex gap-4 pl-4',
        ]"
      >
        <button class="ql-bold">
          <bold-icon class="ql-bold size-4 text-foreground cursor-pointer" />
        </button>
        <button class="ql-italic">
          <italic-icon class="size-4 text-foreground cursor-pointer" />
        </button>
        <button>
          <paper-clip-icon
            class="size-4 text-foreground cursor-pointer"
            @click="uploadFile"
          />
          <input
            ref="fileSelect"
            type="file"
            class="hidden"
            multiple
            @change="onFileChange"
          >
        </button>
        <button
          :data-can-undo="canUndo"
          class="group"
        >
          <arrow-uturn-down-icon
            class="size-4 text-foreground cursor-pointer group-data-[can-undo=false]:text-foreground/50 transition"
            @click="undo"
          />
        </button>
      </div>
      <div
        :class="[
          props.wrapperClass ? props.wrapperClass : 'min-h-32 overflow-auto bg-default-100 rounded-md w-full break-words resize-y',
        ]"
      >
        <div
          ref="editor"
          class="relative text-default-foreground"
          @drag.prevent.stop
          @drop.prevent.stop
        />
      </div>
      <div class="w-full h-fit">
        <comment-editor-file-list ref="fileList" />
        <!-- <comment-editor-files name="hello world" /> -->
      </div>
      <div
        :class="[
          props.footerClass ? props.footerClass : 'w-full h-fit flex-grow-0 flex-shrink basis-auto',
        ]"
      >
        <Button
          type="primary"
          :loading="buttonState === 'loading'"
          @click="onClickSend"
        >
          <template #prefix>
            <paper-airplane-icon
              v-if="buttonState === 'pending'"
              class="size-5 -rotate-180"
            />
          </template>
          发布
        </Button>
      </div>
    </div>
  </div>
</template>

<style>
.ql-editor p{
  word-break: break-all;
}
.ql-editor.ql-blank::before{
  font-style: normal;
}
.dark .ql-editor.ql-blank::before {
  color: #141414;
}
.dark .ql-editor.ql-blank::before {
  color: #ccc;
}
</style>

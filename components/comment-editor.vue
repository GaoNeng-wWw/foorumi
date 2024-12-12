<script lang="ts" setup>
import { BoldIcon, ItalicIcon, ArrowUturnDownIcon, PaperAirplaneIcon } from '@heroicons/vue/24/solid';
import { Button } from '@miraiui-org/vue-button';
import 'quill/dist/quill.bubble.css';
import 'quill/dist/quill.core.css';

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
}
const editor = useTemplateRef('editor');
const canUndo = ref(false);
let quill: import('quill').default;
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

const emit = defineEmits<{
  send: [{
    content: string;
    success: () => void;
    isEmpty: boolean;
  }];
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
  emit('send', { isEmpty, content, success });
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
        />
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

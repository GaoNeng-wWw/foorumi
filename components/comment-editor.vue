<script lang="ts" setup>
import { BoldIcon, ItalicIcon, ArrowUturnDownIcon, PaperAirplaneIcon } from '@heroicons/vue/24/solid';
import { Button } from '@miraiui-org/vue-button';
import 'quill/dist/quill.bubble.css';
import 'quill/dist/quill.core.css';

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
  });
  quill.on('editor-change', () => {
    canUndo.value = Boolean(quill.history.stack.undo.length);
  });
});

const buttonState = ref<'pending' | 'loading'>('pending');

const emit = defineEmits<{ send: [string]; undo: [] }>();
const undo = () => {
  quill.history.undo();
  emit('undo');
};
const onClickSend = () => {
  buttonState.value = 'loading';
  emit('send', quill.getSemanticHTML());
  setTimeout(() => {
    buttonState.value = 'pending';
  }, 5000);
};
</script>

<template>
  <div class="w-full px-4 py-2">
    <div class="w-full flex-col bg-background dark:bg-default-200 p-4 rounded-md space-y-4">
      <div
        id="toolbar"
        class="w-full flex gap-4 pl-4"
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
      <div class="min-h-32 overflow-auto bg-default-100 rounded-md w-full break-words  resize-y">
        <div ref="editor" />
      </div>
      <div
        class="w-full"
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
</style>

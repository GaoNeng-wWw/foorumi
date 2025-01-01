<script lang="ts" setup>
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const modelValue = defineModel<boolean>({ default: false });
const props = defineProps<{
  imgUrl: string;
}>();
const cropperInstance = useTemplateRef('cropper');
const getImage = () => {
  console.log(cropperInstance.value?.getResult().canvas?.toDataURL());
};
setTimeout(() => {
  getImage();
}, 2000);
</script>

<template>
  <dialog-root v-model:open="modelValue">
    <dialog-overlay class="fixed top-0 left-0 w-full h-full z-30 bg-black/30">
      <dialog-content class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-80 max-h-80 h-full w-full p-4 bg-default-100 rounded">
        <div
          class="w-full h-full"
        >
          <cropper
            ref="cropper"
            :src="props.imgUrl"
            auto-zoom
            :resize-image="{
              wheel: {
                ratio: 0.1,
              },
              adjustStencil: false,
              touch: true,
            }"
            class="w-full h-full"
            :min-width="200"
            :min-height="200"
          />
        </div>
      </dialog-content>
    </dialog-overlay>
  </dialog-root>
</template>

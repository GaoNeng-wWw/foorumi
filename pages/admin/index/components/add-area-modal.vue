<script lang="ts" setup>
import userSelect from './user-select.vue';

const visible = defineModel<boolean | undefined>({ required: true, default: false });
const area = reactive({
  name: '',
  manager_id: -1,
  parent: null,
});
const manager = ref();
</script>

<template>
  <dialog-root v-model:open="visible">
    <dialog-overlay class="fixed top-0 left-0 w-full h-full z-30 bg-black/30">
      <dialog-content class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[80vh] max-h-[95vh] w-full bg-default-100 rounded p-4">
        <dialog-title class="mb-4 text-2xl">
          添加区域
        </dialog-title>
        <dialog-description>
          <div class="space-y-2">
            <base-input
              v-model="area.name"
              label="区域名"
              label-posiion="top"
              show-label
            />
            <user-select v-model="manager" />
          </div>
        </dialog-description>
      </dialog-content>
    </dialog-overlay>
  </dialog-root>
</template>

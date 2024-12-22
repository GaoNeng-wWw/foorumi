<script lang="ts" setup>
import { Button as MButton } from '@miraiui-org/vue-button';
import userSelect from './user-select.vue';
import type { TreeSelectData } from '~/components/AppTreeSelect/index.vue';

const visible = defineModel<boolean | undefined>({ required: true, default: false });
const { treeSelectData } = useAreaTree();
const node = ref<TreeSelectData<string> | null>(null);
const { onSubmit, formModel, errors } = useForm({
  model: {
    name: '',
    manager_id: -1,
    parent: node.value?.value ?? null,
  },
  schema: {
    name: (val) => {
      return {
        error: val.length === 0,
        reason: '区域名不能为空',
      };
    },
  },
});

const emits = defineEmits<{
  submit: [ { name: string; manager_id: number; parent: number | null } ];
  cancel: [];
}>();

const onHandleSubmit = (e: Event) => {
  e.stopPropagation();
  e.preventDefault();
  onSubmit((_, errors) => {
    if (errors !== null) {
      return;
    }
    emits('submit', {
      ...unref(formModel),
      parent: node.value ? parseInt(node.value.value) : null,
    });
  });
};
const onCancel = () => {
  emits('cancel');
};
</script>

<template>
  <dialog-root v-model:open="visible">
    <dialog-overlay class="fixed top-0 left-0 w-full h-full z-30 bg-black/30">
      <dialog-content class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[80vh] max-h-[95vh] w-full bg-default-100 rounded p-4">
        <dialog-title class="mb-4 text-2xl">
          添加区域
        </dialog-title>
        <dialog-description>
          <form
            class="space-y-2"
            @submit.prevent="onHandleSubmit"
          >
            <base-input
              v-model="formModel.name"
              :err="Boolean(errors?.name)"
              :error-message="errors?.name"
              label="区域名"
              label-posiion="top"
              show-label
              required
            />
            <div class="space-y-2">
              <label>
                管理员
              </label>
              <user-select v-model="formModel.manager_id" />
            </div>
            <div class="space-y-2 flex flex-col">
              <label for="">父级选择</label>
              <app-tree-select
                v-model:node="node"
                :data="treeSelectData"
                content-width-follow-trigger
              >
                <template #empty>
                  <div class="w-full p-4 text-center text-foreground">
                    相关数据不存在
                  </div>
                </template>
              </app-tree-select>
            </div>
            <div class="space-x-2">
              <m-button
                type="primary"
                @click.stop.prevent="onHandleSubmit"
              >
                提交
              </m-button>
              <m-button
                type="danger"
                @click.stop.prevent="onCancel"
              >
                取消
              </m-button>
            </div>
          </form>
        </dialog-description>
      </dialog-content>
    </dialog-overlay>
  </dialog-root>
</template>

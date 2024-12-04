<script lang="ts" setup>
import { Button } from '@miraiui-org/vue-button';
import { useMessage } from '@miraiui-org/vue-message';
import userSelect from './user-select.vue';

const props = defineProps<{
  managerId: number;
  areaName: string;
  areaId: number;
}>();
const manager = ref();
const model = reactive({
  manager_id: computed(() => manager.value),
  area_name: props.areaName,
});
const { errors, onSubmit } = useForm({
  model,
  schema: {
    manager_id: (val: ComputedRef<unknown>) => {
      if (!val || !val.value) {
        return {
          error: true,
          reason: 'Manager Id不能为空',
        };
      }
      return {
        error: typeof val.value !== 'number',
        reason: `manager_id类型应该为Number但却是${typeof val.value}`,
      };
    },
    area_name: (val: unknown) => {
      const isError = !val || typeof val !== 'string';
      let reason = '';
      if (!val) {
        reason = 'Area Name不能为空';
        return {
          error: isError,
          reason,
        };
      }
      return {
        error: isError,
        reason: `area_name类型应该为字符串但却是${typeof val}`,
      };
    },
  },
});

const emits = defineEmits<{
  ok: [{
    name: string;
    id: number;
    manager_id: number;
    manager: string;
  }];
  cancel: [];
}>();

const onOk = () => {
  if (errors.value) {
    return;
  }
  if (props.areaId === undefined) {
    return;
  }
  $fetch('/api/area', {
    method: 'patch',
    query: {
      id: props.areaId,
    },
    body: {
      name: model.area_name,
      manager_id: model.manager_id.vaule,
    },
  })
    .then(() => {
      emits('ok', {
        id: props.areaId,
        name: model.area_name,
        manager_id: model.manager_id,
        manager: manager.value.label,
      });
    })
    .catch((reason) => {
      useMessage({
        type: 'danger',
        content: reason.data.message,
      });
    });
};

watch(() => props.areaName, () => {
  model.area_name = props.areaName;
}, { immediate: true });
</script>

<template>
  <div class=" space-y-4">
    <form
      class="space-y-2"
      @submit.prevent="() => {
        onSubmit();
        console.log(errors)
      }"
    >
      <base-input
        v-model="model.area_name"
        show-label
        label="区域名称"
        :error-message="errors?.area_name"
        :err="Boolean(errors?.area_name)"
      />
      <div class="space-y-1">
        <label>
          管理员
          <user-select
            v-model="manager"
            :default-id="props.managerId"
            class="mt-2"
            :err="Boolean(errors?.manager_id)"
          />
        </label>
        <span
          v-if="errors?.manager_id"
          class=" text-tiny text-danger font-bold"
        >
          {{ errors.manager_id }}
        </span>
      </div>
    </form>
    <div class="w-full space-x-2">
      <Button
        type="primary"
        @click="onOk"
      >
        提交
      </Button>
      <Button @click.stop="() => emits('cancel')">
        取消
      </Button>
    </div>
  </div>
</template>

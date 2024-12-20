<script lang="ts" setup>
import { Button as MButton } from '@miraiui-org/vue-button';
import type { Simplify } from 'nitropack/types';
import type { AdminAccountData } from '~/composables/useAccountList';

type RoleOption = {
  label: string;
  value: number;
};
const { data } = defineProps<{
  data: Simplify<AdminAccountData | null>;
}>();

const { data: roles, page, totalItems, size } = useRole();
const isLoading = ref(false);
const isEnd = computed(() => (size.value * page.value) >= totalItems.value);
const roleOptions: Ref<RoleOption[]> = ref([]);

watch(roles, () => {
  roleOptions.value.push(
    ...roles.value.map(role => ({
      label: role.name,
      value: role.id,
    })),
  );
  isLoading.value = false;
}, { immediate: true, deep: true });
watch([isEnd, isLoading], () => {
  if (isEnd.value) {
    return;
  }
  page.value = page.value + 1;
}, { immediate: true });

const visible = defineModel<boolean>({ default: false });
const info: Ref<AdminAccountData | null> = ref(unref(data));
const rolesSelectData = ref([]);
const emits = defineEmits<{
  ok: [AdminAccountData | null];
}>();
watch(() => data, () => {
  if (!data) {
    return;
  }
  info.value = data;
}, { immediate: true, deep: true });
const onOk = () => {
  emits('ok', info.value);
  visible.value = false;
  info.value = null;
};
</script>

<template>
  <dialog-root v-model:open="visible">
    <dialog-overlay class="fixed top-0 left-0 w-full h-full z-30 bg-black/30">
      <dialog-content class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[80vh] max-h-[95vh] w-full p-4 bg-default-100 rounded">
        <dialog-title class="text-2xl mb-4">
          用户修改
        </dialog-title>
        <dialog-description>
          <div class="space-y-2">
            <base-input
              v-model="info!.profile!.name"
              label="用户名"
              label-position="top"
              show-label
            />
            <base-input
              v-model="info!.profile!.bio"
              label="用户简介"
              label-position="top"
              show-label
            />
            <div class="space-y-1">
              <label>
                绑定角色
              </label>
              <app-input-select
                v-model="rolesSelectData"
                :options="roleOptions"
                :max-height="128"
              />
            </div>
            <div class="space-y-1">
              <label>封禁结束日期</label>
              <app-date-picker v-model="info!.ban_expire" />
            </div>
            <base-input
              v-model="info!.reason!"
              label="封禁理由"
              label-position="top"
              show-label
            />
          </div>
        </dialog-description>
        <div class="w-fit mt-4 ml-auto mr-0">
          <dialog-close as-child>
            <m-button
              type="primary"
              @click="onOk"
            >
              确认
            </m-button>
            <m-button
              class="ml-4"
              @click="visible = false"
            >
              取消
            </m-button>
          </dialog-close>
        </div>
      </dialog-content>
    </dialog-overlay>
  </dialog-root>
</template>

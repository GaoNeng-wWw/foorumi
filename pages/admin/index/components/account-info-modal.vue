<script lang="ts" setup>
import { Button as MButton } from '@miraiui-org/vue-button';
import type { Simplify } from 'nitropack/types';
import type { AppTagSelectOption } from '~/components/AppTagSelect/index.type';
import type { AdminAccountData } from '~/composables/useAccountList';

const { data } = defineProps<{
  data: Simplify<AdminAccountData | null>;
}>();

const { allRole: roles } = useRole();
const roleOptions: Ref<AppTagSelectOption<number>[]> = computed(() => {
  return roles.value
    ? roles.value.map((role) => {
      return {
        label: role.name,
        value: role.id,
      };
    })
    : [];
});

const visible = defineModel<boolean>({ default: false });
const info: Ref<AdminAccountData | null> = ref(unref(data));
const rolesSelectData = ref<number[]>([]);
const emits = defineEmits<{
  ok: [AdminAccountData | null, number[]];
}>();
watch(() => data, () => {
  if (!data) {
    return;
  }
  info.value = data;
  rolesSelectData.value = info.value.profile?.role.map((role) => {
    return role.id;
  }) ?? [];
}, { immediate: true, deep: true });

const errors = reactive({
  banExpire: '',
});

watch(info, () => {
  if (info.value?.ban && info.value?.ban_expire && errors.banExpire) {
    errors.banExpire = '';
  }
}, { deep: true });

const onOk = () => {
  if (info.value?.ban && !info.value.ban_expire) {
    errors.banExpire = '您必须设定一个封禁过期时间';
    visible.value = true;
    return;
  }
  emits('ok', info.value, rolesSelectData.value);
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
              <app-tag-select
                v-model="rolesSelectData"
                :options="roleOptions"
                :max-height="128"
              />
            </div>
            <div class="flex items-center gap-2">
              <label
                for="ban"
                class="cursor-pointer"
              >
                封禁
              </label>
              <app-check-box
                id="ban"
                v-model="info!.ban"
                name="ban"
              />
            </div>
            <div class="space-y-1">
              <label>封禁结束日期</label>
              <app-date-picker
                v-model="info!.ban_expire"
                :error="Boolean(errors.banExpire.length)"
                :desc="errors.banExpire"
              />
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
              @click.prevent="onOk"
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

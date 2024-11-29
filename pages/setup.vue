<script lang="ts" setup>
import { Button } from '@miraiui-org/vue-button';
import { useMessage } from '@miraiui-org/vue-message';

definePageMeta({
  setup: false,
});

interface SiteMeta {
  siteName: string;
  adminEmail: string;
  adminPassword: string;
  adminUserName: string;
}
const siteMeta = reactive<SiteMeta>({
  siteName: '',
  adminEmail: '',
  adminPassword: '',
  adminUserName: '',
});

const errorMap = reactive({
  siteName: '站点名称不能为空',
  adminEmail: '',
  adminUserName: '管理员用户名不能为空',
  adminPassword: '管理员密码不能为空',
});

// data is lock
const { data } = await useFetch('/api/setup', { method: 'get' });
if (data.value) {
  navigateTo('/');
}

const required = (val: string) => Boolean(val.length);
const isEmail = (val: string) => /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val);
const emailValidator = (val: string) => {
  const isRequired = required(val);
  if (!isRequired) {
    errorMap.adminEmail = '邮箱不能为空';
    return isRequired;
  }
  const email = isEmail(val);

  if (!email) {
    errorMap.adminEmail = '邮箱格式不正确';
    return email;
  }
  errorMap.adminEmail = '';
  return true;
};
const setupLoading = ref(false);
const setup = () => {
  setupLoading.value = true;
  const valid = Object.values(siteMeta).every(required) && isEmail(siteMeta.adminEmail);
  if (!valid) {
    setupLoading.value = false;
    return;
  }
  $fetch(
    '/api/setup',
    {
      method: 'post',
      body: siteMeta,
      onResponseError: (resp) => {
        const err = (resp.response._data as ApiCommonError).data.error;
        useMessage({
          content: err,
          type: 'danger',
        });
      },
    },
  )
    .finally(() => {
      setupLoading.value = false;
    });
};
</script>

<template>
  <div class="w-full h-screen relative">
    <div class="max-w-sm w-full p-4 rounded m-auto absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-default-100">
      <div>
        <h1 class="text-center text-2xl">
          Site Setup
        </h1>
      </div>
      <div class="mt-4 space-y-2">
        <base-input
          v-model="siteMeta.siteName"
          label="Site Name"
          label-position="top"
          show-label
          :validator="required"
          :error-message="errorMap.siteName"
          :trigger="['input', 'blur']"
        />
        <base-input
          v-model="siteMeta.adminEmail"
          label="Admin Email"
          label-position="top"
          show-label
          :validator="emailValidator"
          trigger="input"
          :error-message="errorMap.adminEmail"
        />
        <base-input
          v-model="siteMeta.adminUserName"
          label="Admin User Name"
          label-position="top"
          show-label
          :validator="required"
          :error-message="errorMap.adminUserName"
          :trigger="['input', 'blur']"
        />
        <password-input
          v-model="siteMeta.adminPassword"
          label="Admin Password"
          label-position="top"
          show-label
          :validator="required"
          :error-message="errorMap.adminPassword"
          :trigger="['input', 'blur']"
        />
      </div>
      <div class="mt-4">
        <Button
          :loading="setupLoading"
          @click="setup"
        >
          Submit
        </Button>
      </div>
    </div>
  </div>
</template>

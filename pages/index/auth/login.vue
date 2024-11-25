<script lang="ts" setup>
import { Button } from '@miraiui-org/vue-button';
import { z } from 'zod';
import { useMessage } from '@miraiui-org/vue-message';

const loginData = reactive({
  email: 'ret0@no-reply.com',
  password: '123',
});
const errorTips = reactive({
  email: '',
  password: '',
});

const rules = {
  email: z.string().min(1).email(),
  password: z.string().min(1),
};

const valid = (field: 'email' | 'password' | 'all'): boolean => {
  if (field === 'all') {
    return valid('email') && valid('password');
  }
  errorTips[field] = '';
  const { error } = rules[field].safeParse(loginData[field]);
  if (error) {
    errorTips[field] = error.issues[0].message;
  }
  return !errorTips[field].length;
};

const onLogin = () => {
  if (!valid('all')) {
    return;
  }
  const { fetch } = useUserSession();
  $fetch(
    '/api/auth/login',
    {
      method: 'post',
      body: {
        ...loginData,
      },
    },
  )
    .then(() => {
      return fetch();
    })
    .then(() => {
      navigateTo('/');
    })
    .catch((reason) => {
      console.log(reason);
      useMessage({
        content: reason.data.message,
        type: 'danger',
      });
    });
};
</script>

<template>
  <div class="w-full h-full flex">
    <form
      class="max-w-md w-full h-full mx-auto flex flex-col items-center justify-center"
      @submit.prevent
    >
      <div class="w-full space-y-2">
        <h1 class="text-4xl text-center leading-none">
          {{ $t('ui.auth.login.title') }}
        </h1>
        <base-input
          v-model="loginData.email"
          show-label
          require-icon
          :label="$t('ui.auth.login.email')"
          :err="Boolean(errorTips.email.length)"
          :error-message="errorTips.email"
          :trigger="['blur']"
          :validator="() => valid('email')"
          @blur="() => valid('email')"
          @click="() => valid('email')"
        />
        <base-input
          v-model="loginData.password"
          show-label
          :label="$t('ui.auth.login.password')"
          type="password"
          require-icon
          :err="Boolean(errorTips.password.length)"
          :error-message="errorTips.password"
          :trigger="['blur']"
          :validator="() => valid('password')"
          @blur="() => valid('password')"
          @click="() => valid('password')"
        />
        <div>
          <Button
            class="w-full my-4"
            size="lg"
            type="primary"
            @click="onLogin"
          >
            Submit
          </Button>
          <nuxt-link to="/auth/register">
            {{ $t('ui.auth.register.link.content') }}
          </nuxt-link>
        </div>
      </div>
    </form>
  </div>
</template>

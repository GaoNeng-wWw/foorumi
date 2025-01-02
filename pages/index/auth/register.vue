<script lang="ts" setup>
import { Button } from '@miraiui-org/vue-button';
import { useMessage } from '@miraiui-org/vue-message';

const registerData = reactive({
  email: '',
  password: '',
  inviteCode: '',
  nick: '',
  bio: '',
});
const siteMeta = useState<SiteMeta>('siteMeta');
const { t } = useI18n();
const register = () => {
  $fetch(
    '/api/auth/register',
    {
      method: 'post',
      body: {
        ...registerData,
      },
    },
  )
    .then(() => {
      useMessage({
        content: t('ui.auth.register.success.tip'),
        type: 'success',
      });
    })
    .then(() => {
      navigateTo('/auth/login');
    })
    .catch((reason) => {
      useMessage({
        content: reason.data.message,
        type: 'danger',
      });
    });
};
definePageMeta({
  public: true,
});
</script>

<template>
  <div class="w-full h-full flex px-2">
    <form
      class="max-w-md w-full h-full mx-auto flex flex-col items-center justify-start space-y-2 pt-4"
      @submit.prevent
    >
      <div class="w-full">
        <h1 class="text-4xl text-center leading-none">
          {{ $t('ui.auth.register.title') }}
        </h1>
      </div>
      <base-input
        v-model="registerData.email"
        show-label
        :label="$t('ui.auth.register.form.email.title')"
        :description="$t('ui.auth.register.form.email.desc')"
        desc-class="text-normal text-tiny text-foreground/80"
        required
      />
      <base-input
        v-model="registerData.password"
        show-label
        :label="$t('ui.auth.register.form.password.title')"
        desc-class="text-normal text-tiny text-foreground/80"
        required
        type="password"
      />
      <base-input
        v-if="!siteMeta?.isPublic"
        v-model="registerData.inviteCode"
        show-label
        :label="$t('ui.auth.register.form.inviteCode.title')"
        desc-class="text-normal text-tiny text-foreground/80"
        required
      />
      <base-input
        v-model="registerData.nick"
        show-label
        :label="$t('ui.auth.register.form.nick.title')"
        :description="$t('ui.auth.register.form.nick.desc')"
        desc-class="text-normal text-tiny text-foreground/80"
        required
      />
      <base-input
        v-model="registerData.bio"
        show-label
        :label="$t('ui.auth.register.form.bio.title')"
        :description="$t('ui.auth.register.form.bio.desc')"
        desc-class="text-normal text-tiny text-foreground/80"
        required
      />
      <div class="w-full">
        <Button
          class="w-full"
          size="lg"
          @click.stop="register"
        >
          Register
        </Button>
      </div>
    </form>
  </div>
</template>

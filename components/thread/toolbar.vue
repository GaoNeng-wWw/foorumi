<script lang="ts" setup>
import { Button as MButton } from '@miraiui-org/vue-button';
import type { Permission, Profile } from '@prisma/client';
import { useMessage } from '@miraiui-org/vue-message';
import { THREAD_ITEM_CONTEXT_KEY, type ThreadItemContext } from './context.type';
import { PERMISSIONS, PROFILE } from '~/lib/constant';

const { threadId } = inject<ThreadItemContext>(THREAD_ITEM_CONTEXT_KEY)!;
const permissions = useState<Permission[]>(PERMISSIONS);
const profile = useState<Pick<Profile, 'name' | 'bio' | 'account_id'> | null>(PROFILE);
const showReply = defineModel<boolean>();
const hidden = defineModel<boolean>('isHidden');
const hiddenReason = defineModel<string>('reason', { default: '' });
const { floor, authorId } = defineProps<{
  floor: string;
  authorId: number;
}>();
const show = ref(false);
const emits = defineEmits<{
  reply: [];
  hiddenSuccess: [number, string];
}>();
const onClickReply = () => {
  showReply.value = !showReply.value;
  emits('reply');
};
const permissionNames = computed(() => permissions.value.map(permission => permission.name));
const canUnHidden = computed(() => {
  const haveSuperPermission = permissionNames.value.includes('*');
  if (haveSuperPermission) {
    return true;
  }
  const allowRemoveOther = permissionNames.value.includes('thread::update::other');
  if (allowRemoveOther) {
    return true;
  }
  const isSelfThread = profile.value?.account_id ? (profile.value.account_id === authorId) : false;
  return isSelfThread && permissionNames.value.includes('thread::update::self');
});
const canHidden = computed(() => {
  const haveSuperPermission = permissionNames.value.includes('*');
  if (haveSuperPermission) {
    return true;
  }
  const allowRemoveOther = permissionNames.value.includes('thread::hidden::other');
  if (allowRemoveOther) {
    return true;
  }
  const isSelfThread = profile.value?.account_id ? (profile.value.account_id === authorId) : false;
  return isSelfThread && permissionNames.value.includes('thread::hidden::self');
});
const close = () => {
  show.value = false;
  hiddenReason.value = '';
};
const router = useRouter();
const setUnHidden = () => {
  $fetch(`/api/threads/${unref(threadId)}`, {
    method: 'patch',
    body: {
      hidden: false,
    },
  })
    .then(() => {
      hidden.value = false;
      router.go(0);
    })
    .catch((err) => {
      useMessage({
        type: 'danger',
        content: err.data.message,
      });
    });
};
const submitHidden = () => {
  $fetch(`/api/threads/${unref(threadId)}`, {
    method: 'delete',
    body: {
      reason: unref(hiddenReason),
    },
  })
    .then(() => {
      emits('hiddenSuccess', unref(threadId), unref(hiddenReason));
    })
    .catch((err) => {
      useMessage({
        content: err.data.message,
        type: 'danger',
      });
    })
    .finally(() => {
      close();
    });
};
</script>

<template>
  <div class="w-full mt-2 flex">
    <div class="ml-auto gap-4 flex">
      <span>举报</span>
      <span
        v-if="hidden && canUnHidden"
        @click="setUnHidden"
      >
        解除隐藏
      </span>
      <div v-if="canHidden && !hidden">
        <app-popover
          v-model:open="show"
          :force-mount="false"
        >
          <template #trigger>
            <span
              class="text-danger cursor-pointer"
            >
              隐藏
            </span>
          </template>
          <div class="p-2 rounded-lg bg-default-100 shadow-sm space-y-2">
            <base-input
              v-model="hiddenReason"
              show-label
              label="隐藏理由"
              label-position="top"
            />
            <div class="w-full space-x-2">
              <m-button
                type="primary"
                @click="submitHidden"
              >
                提交
              </m-button>
              <m-button @click="close">
                取消
              </m-button>
            </div>
          </div>
        </app-popover>
      </div>
      <div class="space-x-2 inline-block">
        <span>#{{ floor }}</span>
        <span
          class="cursor-pointer"
          @click="onClickReply"
        >
          回复
        </span>
      </div>
    </div>
  </div>
</template>

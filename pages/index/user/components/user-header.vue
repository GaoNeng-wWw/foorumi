<script lang="ts" setup>
import { useMessage } from '@miraiui-org/vue-message';

const { id } = defineProps<{ id: string }>();
const userId = computed(() => id.toString());
const { user } = useUserSession();
const { data, status } = useFetch(`/api/profile/${userId.value}`, { method: 'get' });
const profile = reactive({
  bio: data.value?.bio,
  name: data.value?.name,
});
const patchProfile = () => {
  if (userId.value !== user.value?.id.toString()) {
    return;
  }
  if (profile.name === data.value.name && profile.bio === data.value.bio) {
    return;
  }
  $fetch(`/api/profile/${userId.value}`, {
    method: 'patch',
    body: {
      name: profile.name,
      bio: profile.bio,
    },
  })
    .then(() => {
      useMessage({
      // TODO: I18
        content: '修改成功',
      });
    })
    .catch((err) => {
      useMessage({
        content: err.data.message,
        type: 'danger',
      });
    });
};

watch(data, () => {
  profile.bio = data.value?.bio;
  profile.name = data.value?.name;
}, { immediate: true });
</script>

<template>
  <div
    v-if="status === 'success' && data"
    class="w-full"
  >
    <div class="w-full px-4 py-4 flex gap-2">
      <div class="bg-default size-20" />
      <div class="flex-auto flex flex-col justify-around">
        <input
          v-model="profile.name"
          :data-can-edit="user?.id.toString() === userId"
          class="
            p-2 rounded bg-transparent outline-none cursor-pointer transition duration-normal
            hover:bg-background dark:hover:bg-default/50 focus:bg-background focus:dark:bg-default/50
            data-[can-edit=false]:pointer-events-none
          "
          tabindex="-1"
          @blur="patchProfile"
        >
        <input
          v-model="profile.bio"
          :data-can-edit="user?.id.toString() === userId"
          class="
            p-2 rounded bg-transparent outline-none cursor-pointer transition duration-normal
            hover:bg-background dark:hover:bg-default/50 focus:bg-background focus:dark:bg-default/50
            data-[can-edit=false]:pointer-events-none
          "
          tabindex="-1"
          @blur="patchProfile"
        >
      </div>
    </div>
  </div>
</template>

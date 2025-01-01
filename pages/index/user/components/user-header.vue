<script lang="ts" setup>
import { useMessage } from '@miraiui-org/vue-message';

const file = useTemplateRef('file');
const router = useRouter();
const { id } = defineProps<{ id: string }>();
const userId = computed(() => id.toString());
const url = ref('/images/a4fa5161369727154bc3a7d1c52bb9c0.png');
const { user } = useUserSession();
const { data, status } = useFetch(
  `/api/profile/${userId.value}`,
  {
    method: 'get',
    onResponseError: () => {},
  },
);
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
const getUserAvatar = () => {
  $fetch(
    `/api/avatar/${id}`,
    {
      method: 'get',
    },
  )
    .then((resp) => {
      return resp as Blob;
    })
    .then((blob) => {
      return URL.createObjectURL(blob);
    })
    .then((imageUrl) => {
      url.value = imageUrl;
    })
    .catch(() => {

    });
};
const changeAvatar = () => {
  if (!file.value) {
    router.go(0);
    return;
  }
  const fileInput = file.value;
  fileInput.click();
};
const onFileChange = () => {
  const fileInput = file.value;
  const files = fileInput?.files ?? [];
  const image = files[0];
  const formData = new FormData();
  formData.append('avatar', image);
  $fetch(`/api/avatar`, {
    query: { id: unref(id) },
    method: 'post',
    body: formData,
  })
    .then(() => {
      getUserAvatar();
    })
    .catch((err) => {
      console.log(err);
    });
};

getUserAvatar();
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
    <div class="w-full px-4 py-4 flex items-center justify-center max-[320px]:flex-wrap gap-2">
      <img
        class="size-20 aspect-square object-contain data-[can-edit=true]:cursor-pointer"
        :data-can-edit="user?.id.toString() === userId"
        :src="url"
        @click="changeAvatar"
      >
      <input
        ref="file"
        class="fixed invisible top-0 left-0"
        type="file"
        accept="image/gif,image/png,image/jpeg,image/webp,image/avif"
        @change="onFileChange"
      >
      <div class="flex-auto flex flex-col justify-around">
        <input
          v-model="profile.name"
          :data-can-edit="user?.id.toString() === userId"
          class="
            p-2 rounded bg-transparent outline-none cursor-pointer transition duration-normal
            hover:bg-background dark:hover:bg-default/50 focus:bg-background focus:dark:bg-default/50
            data-[can-edit=false]:pointer-events-none max-[320px]:text-center
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
            data-[can-edit=false]:pointer-events-none max-[320px]:text-center
          "
          tabindex="-1"
          @blur="patchProfile"
        >
      </div>
    </div>
  </div>
</template>

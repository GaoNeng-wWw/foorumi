<script lang="ts" setup>
const route = useRoute();
const { params: { id } } = route;
const userId = computed(() => id.toString());
const { user } = useUserSession();
const { data, status } = useFetch(`/api/profile/${userId.value}`, { method: 'get' });
const profile = reactive({
  bio: data.value?.bio,
  name: data.value?.name,
});
const patchBio = () => {
  if (userId.value !== user.value?.id.toString()) {
    return;
  }
  console.log(userId.value);
};

watch(data, () => {
  profile.bio = data.value?.bio;
  profile.name = data.value?.name;
}, { immediate: true });
</script>

<template>
  <div
    v-if="status === 'success' && data"
    class="max-w-6xl mx-auto"
  >
    <div class="w-full px-4 py-4 flex gap-2">
      <div class="bg-default size-20" />
      <div class="flex-auto flex flex-col justify-around">
        <span class="px-2">aaa</span>
        <input
          v-model="profile.bio"
          :data-can-edit="user?.id.toString() === userId"
          class="
            p-2 rounded bg-transparent outline-none cursor-pointer transition duration-normal
            hover:bg-background dark:hover:bg-default/50 focus:bg-background focus:dark:bg-default/50
            data-[can-edit=false]:pointer-events-none
          "
          tabindex="-1"
          @blur="patchBio"
        >
      </div>
    </div>
  </div>
</template>

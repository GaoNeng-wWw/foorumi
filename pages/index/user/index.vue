<script lang="ts" setup>
const router = useRouter();
const session = useUserSession();
watch(session, () => {
  if (!session.user.value) {
    return;
  }
  router.replace(`/user/${session.user.value?.id}`);
}, { deep: true, immediate: true });
</script>

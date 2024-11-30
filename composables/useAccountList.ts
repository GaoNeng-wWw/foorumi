export const useAccountList = ({ initializationPage }: { initializationPage?: Ref<number> | number }) => {
  const page = ref(unref(initializationPage) ?? 1);
  const { data, error, status } = useFetch('/api/account/list', { method: 'get', query: { page }, cache: 'default', watch: [page] });
  const isFinish = computed(() => data.value?.end);
  const next = () => {
    if (isFinish.value) {
      return;
    }
    page.value += 1;
  };
  const prev = () => {
    if (page.value === 0) {
      return;
    }
    page.value -= 1;
  };
  return { accountList: data, error, status, isFinish, next, prev };
};

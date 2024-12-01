export const useAreaList = ({ initializationPage }: { initializationPage?: Ref<number> | number }) => {
  const page = ref(unref(initializationPage) ?? 1);
  const { data, error, status } = useFetch('/api/area', { method: 'get', query: { page }, cache: 'default', watch: [page], server: false });
  const isFinish = computed(() => data.value?.end);
  const totalItems = computed(() => data.value?.total ?? 1);
  return { areaList: computed(() => data.value?.data ?? []), error, status, isFinish, totalItems, areaPage: page };
};

import type { SerializeObject } from 'nitropack/types';

export interface UsePostList {
  area: ComputedRef<string>;
  pageSize: ComputedRef<number>;
  currentPage: ComputedRef<number>;
  pin: ComputedRef<boolean> | boolean;
  type: ComputedRef<'update_at' | 'floors'>;
}

type PostList = {
  size: number;
  total: number;
  data: SerializeObject<{
    update_at: Date;
    id: number;
    title: string;
    content: string;
    author_id: number;
    hidden: boolean;
    hidden_reason: boolean;
    aid: number;
    create_at: Date;
  }>[];
};

export const usePostList = (
  opts: Partial<UsePostList>,
) => {
  const {
    pageSize,
    currentPage,
    pin,
    type,
  } = opts;
  const page = ref(unref(currentPage) ?? 1);
  const area = ref(opts.area?.value);
  const { data, status, error } = useFetch('/api/posts/list', {
    query: {
      pin: unref(pin),
      page,
      size: pageSize?.value,
      type: type?.value,
    },
    server: !import.meta.dev,
    watch: [page, area],
    cache: 'force-cache',
  });
  const postList: Ref<PostList['data']> = ref([]);
  const nextPage = () => {
    page.value += 1;
    console.log(page.value);
  };
  const prevPage = () => {
    if (page.value <= 1) {
      return;
    }
    page.value -= 1;
  };

  watch(
    () => data,
    () => {
      postList.value.push(...data?.value?.data ?? []);
    }, { immediate: true, deep: true });

  watch(() => opts.area, () => {
    postList.value = [];
    page.value = 1;
    area.value = opts.area?.value;
  }, { deep: true });
  const loading = computed(() => status.value === 'pending');
  const canLoadMore = () => {
    console.log(page.value, data.value?.total);
    return page.value !== data.value?.total && !loading.value;
  };
  return {
    postList,
    loading,
    success: computed(() => status.value === 'success'),
    error,
    nextPage,
    prevPage,
    canLoadMore,
  };
};

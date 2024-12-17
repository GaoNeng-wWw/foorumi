import type { SerializeObject } from 'nitropack/types';

export interface UsePostList {
  area: ComputedRef<string>;
  pageSize: ComputedRef<number>;
  currentPage: ComputedRef<number>;
  pin: ComputedRef<boolean> | boolean;
  type: ComputedRef<'new' | 'hot'>;
  authorId: ComputedRef<number>;
}

type PostList = {
  size: number;
  total: number;
  data: SerializeObject<{
    pin: boolean;
    floors: number;
    id: number;
    title: string;
    author_id: number;
    author: {
      name: string;
    };
    create_at: string;
    update_at: string;
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
  const authorId = ref(opts.authorId?.value);
  const { data, status, error } = useFetch(`/api/posts/list`, {
    params: {
      pin: unref(pin),
      page,
      size: pageSize?.value,
      type: type?.value,
      area_id: area,
      author_id: authorId?.value,
    },
    watch: [page, area, authorId],
    server: !import.meta.dev,
  });
  const unsafePostList: Ref<Set<PostList['data'][number]>> = ref(new Set());
  const idSet: Ref<Set<number>> = ref(new Set());
  const postList: ComputedRef<PostList['data']> = computed(() => {
    if (unsafePostList.value.size) {
      return Array.from<SerializeObject<PostList['data'][number]>>(unsafePostList.value);
    }
    return [];
  });
  const nextPage = () => {
    page.value += 1;
  };
  const prevPage = () => {
    if (page.value <= 1) {
      return;
    }
    page.value -= 1;
  };
  watch(data, () => {
    if (page.value === 1 && postList.value.length > 0) {
      unsafePostList.value = new Set();
      idSet.value = new Set();
    }
    data.value?.data.forEach((item) => {
      if (idSet.value.has(item.id)) {
        return;
      }
      unsafePostList.value.add(item);
      idSet.value.add(item.id);
    });
  }, { immediate: true, deep: true });

  watch(() => opts.area, () => {
    unsafePostList.value = new Set();
    idSet.value = new Set();
    area.value = opts.area?.value.toString();
    page.value = 1;
  }, { deep: true });
  watch(() => opts.authorId, () => {
    authorId.value = opts.authorId?.value;
  }, { deep: true });
  const loading = computed(() => status.value === 'pending');
  const canLoadMore = () => {
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

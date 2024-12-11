import type { SerializeObject } from 'nitropack/types';

export type FlatAuthor = {
  /**
   * @description If you have sufficient permissions. Can send GET /user/:id to get this user's profile
   */
  id: number;
  name: string;
  bio: string;
};

export type RawThread = SerializeObject<{
  content: string;
  create_at: Date;
  update_at: Date;
  author: FlatAuthor;
}>;

export type RawThreadList = SerializeObject<{
  data: RawThread;
  /**
   * @description total threads
   */
  total: number;
  /**
   * @description number of item perpage
   */
  size: number;
}>;

export type Thread = {
  authorId: number;
  authorName: string;
  content: string;
  showCreateAt: string;
  showUpdateAt: string;
  createAt: Date;
  updateAt: Date;
};

export type UseThreadsOptions = {
  id: MaybeRef<number>;
  size?: MaybeRef<number>;
  /**
   * @description No reactivity. Because you can direct use `jump(to)` function change current page.
   */
  defaultPage?: number;
};

export const useThreads = (
  {
    id,
    size = 20,
    defaultPage = 1,
  }: UseThreadsOptions,
) => {
  const pageSize = computed(() => size);
  const threadId = computed(() => isRef(id) ? id.value : id);
  const page = ref(defaultPage);
  const { data, error, status } = useFetch(`/api/threads/`, {
    query: {
      size: pageSize,
      page,
    },
    params: {
      id: unref(threadId),
    },
    method: 'get',
    server: false,
    watch: [threadId],
    lazy: true,
  });
  const loading = useDebounce(computed(() => status.value === 'pending'), 200);
  const reason = computed(() => error.value?.data.message);
  const nextPage = () => {
    page.value += 1;
  };
  const prevPage = () => {
    page.value -= 1;
  };
  const to = (to: number) => {
    page.value = to;
  };
  const threadList = computed(() => {
    if (!data.value?.data || !data.value.data.length) {
      return [];
    }
    return data.value.data.map<Thread>((rawThread) => {
      return {
        authorId: rawThread.author.id,
        authorName: rawThread.author.name,
        showCreateAt: rawThread.create_at,
        showUpdateAt: rawThread.update_at,
        content: rawThread.content,
        createAt: new Date(rawThread.create_at),
        updateAt: new Date(rawThread.update_at),
      };
    });
  });
  return {
    loading,
    reason,
    nextPage,
    prevPage,
    to,
    threadList,
    totalItems: computed(() => data.value?.total),
    size: computed(() => data.value?.size),
  };
};

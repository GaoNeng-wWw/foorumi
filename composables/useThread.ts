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
  data: {
    title: string;
    threads: RawThread[];
  };
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
  id: number;
  authorId: number;
  authorName: string;
  content: string;
  showCreateAt: string;
  showUpdateAt: string;
  createAt: Date;
  updateAt: Date;
  floor: string;
  hidden: boolean;
  reason: string;
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
  const router = useRouter();
  const route = useRoute();
  const pageSize = computed(() => unref(size));
  const threadId = computed(() => isRef(id) ? id.value : id);
  const page = ref(Number.parseInt(route.params.page?.toString() ?? '1') ?? defaultPage);
  const author_id: Ref<number | undefined> = ref(undefined);
  const { data, error, status } = useFetch(`/api/threads/`, {
    query: {
      size: pageSize,
      page,
    },
    params: {
      id: unref(threadId),
      author: unref(author_id),
    },
    method: 'get',
    server: false,
    watch: [threadId, author_id],
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
    const currentPath = route.path;
    router.push({
      path: currentPath,
      query: {
        page: to,
      },
    });
  };
  const filterByAuthorId = (id: number) => {
    if (author_id.value === id) {
      author_id.value = undefined;
      return;
    }
    author_id.value = id;
  };
  const threadTitle = computed(() => data.value?.data ? data.value.data.title : '');
  const threadList = computed(() => {
    if (!data.value?.data || !data.value.data.threads.length) {
      return [];
    }
    return data.value.data.threads.map<Thread>((rawThread) => {
      return {
        authorId: rawThread.author.id,
        authorName: rawThread.author.name,
        showCreateAt: rawThread.create_at,
        showUpdateAt: rawThread.update_at,
        content: rawThread.content,
        createAt: new Date(rawThread.create_at),
        updateAt: new Date(rawThread.update_at),
        floor: rawThread.floor,
        id: rawThread.id,
        hidden: rawThread.hidden,
        reason: rawThread.reason,
      };
    });
  });
  const toLast = () => {
    page.value = Math.ceil((data.value?.total ?? 1) / (unref(pageSize) ?? 1));
    // console.log((data.value?.total ?? 1) / (unref(pageSize) ?? 1));
  };
  return {
    loading,
    reason,
    threadList,
    threadTitle,
    author_id,
    nextPage,
    prevPage,
    to,
    filterByAuthorId,
    toLast,
    totalItems: computed(() => data.value?.total),
    size: computed(() => data.value?.size),
    page,
  };
};

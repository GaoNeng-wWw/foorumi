import type { SerializeObject } from 'nitropack/types';

export type UseThreadReply = {
  id: MaybeRef<number>;
  floor: MaybeRef<string>;
  page: Ref<number>;
  immediate: boolean;
};
type ThreadReply = SerializeObject<{
  id: number;
  author_id: number;
  content: string;
  author: {
    name: string;
    bio: string;
  };
  updateAt: Date;
  createAt: Date;
  parent: number;
  hot: string;
}>;
export const useThreadReply = (
  opts: UseThreadReply,
) => {
  const { id, page: initializationPage, immediate, floor } = opts;
  const page = ref(initializationPage);
  const { data: staticThreadReplies, status, error, execute } = useFetch(
    `/api/reply/thread/${unref(id)}`,
    {
      method: 'get',
      params: {
        page,
        floor,
        size: 5,
      },
      watch: [page],
      server: false,
      immediate,
    },
  );
  const threadReplies: Ref<ThreadReply[]> = ref([]);
  const loading = computed(() => status.value === 'pending');
  const next = () => {
    page.value += 1;
  };
  const prev = () => {
    page.value -= 1;
  };
  const to = (target: number) => {
    page.value = target;
  };
  const appendThreadReply = (
    reply: ThreadReply,
  ) => {
    threadReplies.value.push(reply);
  };
  const sendReply = (content: string) => {
    return $fetch<ThreadReply>(`/api/reply/thread/${unref(id)}`, {
      body: { content, floor: unref(floor) },
      method: 'post',
    })
      .then((rep) => {
        const reply = rep;
        appendThreadReply(reply);
        return rep;
      });
  };
  const total = computed(() => staticThreadReplies.value?.total ?? 0);
  const size = computed(() => staticThreadReplies.value?.size ?? 0);
  watch(staticThreadReplies, () => {
    if (staticThreadReplies.value?.data) {
      threadReplies.value = staticThreadReplies.value.data;
    }
  }, { immediate: true, deep: true });
  return { threadReplies, total, size, status, error, to, next, prev, loading, appendThreadReply, execute, sendReply };
};

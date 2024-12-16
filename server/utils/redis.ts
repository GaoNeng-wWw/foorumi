export const INVITE_NS = 'INVITE-CODES';
export const PERMISSION_NS = 'PERMISSIONS';
export const POSTLIST_COUNT_NS = (areaId: number) => `post-list::${areaId}::total`;
export const TRHEADS = (postId: number) => `thread::${postId}::total`;
export const HIDDEN_THREADS = (postId: number) => `thread::${postId}::hidden::total`;
export const THREAD_REPLY = (threadId: number, floor: number) => `thread::reply::${threadId}::${floor}::total`;
export const useRedis = () => {
  return useStorage('redis');
};
export const incr = async (key: string) => {
  const redis = useRedis();
  const cnt = Number.parseInt(await redis.getItem(key) ?? '0');
  return redis.setItem(key, cnt + 1);
};

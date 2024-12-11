export const INVITE_NS = 'INVITE-CODES';
export const PERMISSION_NS = 'PERMISSIONS';
export const POSTLIST_COUNT_NS = (areaId: number) => `post-list::${areaId}::total`;
export const TRHEADS = (postId: number) => `thread::${postId}::total`;
export const useRedis = () => {
  return useStorage('redis');
};

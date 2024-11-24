export const INVITE_NS = 'INVITE-CODES';
export const useRedis = () => {
  return useStorage('redis');
};

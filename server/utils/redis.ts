export const INVITE_NS = 'INVITE-CODES';
export const PERMISSION_NS = 'PERMISSIONS';
export const useRedis = () => {
  return useStorage('redis');
};

export default defineEventHandler(async () => {
  const storage = useStorage('redis');
  const lock = await storage.getItem('lock');
  return lock;
});

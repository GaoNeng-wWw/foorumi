export default defineEventHandler(async () => {
  const storage = useStorage('redis');
  const siteInfo = await storage.getItem('meta');
  return siteInfo;
});

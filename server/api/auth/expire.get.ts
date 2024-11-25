import { decode, verify } from '@tsndr/cloudflare-worker-jwt';
import { accessTokenNs, refreshTokenNs } from '~/server/ns';

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session.user) {
    return 'refresh';
  }
  const { user: { access_token, refresh_token } } = session;
  const refreshData = decode<JwtPayload>(refresh_token);
  const redis = useRedis();

  const id = refreshData.payload?.id;

  try {
    await verify(refresh_token, process.env.NUXT_TOKEN_PASSWORD, { throwError: true });
  } catch {
    return 'refresh';
  }

  try {
    await verify(access_token, process.env.NUXT_TOKEN_PASSWORD, { throwError: true });
  } catch {
    return 'access';
  }

  if (!id) {
    return 'refresh';
  }
  // refresh_token 过期
  if (await redis.getItem(refreshTokenNs(id)) !== refresh_token) {
    return 'refresh';
  }

  // access_token 过期
  if (await redis.getItem(accessTokenNs(id)) !== access_token) {
    return 'access';
  }
  return '';
});

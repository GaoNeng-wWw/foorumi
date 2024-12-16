import { decode, verify } from '@tsndr/cloudflare-worker-jwt';
import status from 'http-status';
import ms from 'ms';
import { createToken } from '~/server/jwt';
import { accessTokenNs, refreshTokenNs } from '~/server/ns';

export default defineEventHandler(async (event) => {
  const { user: { access_token, refresh_token } = { access_token: '', refresh_token: '' } } = await getUserSession(event);
  const t = await useTranslation(event);
  if (!access_token || !refresh_token) {
    throw createError({
      status: status.UNAUTHORIZED,
      statusMessage: status['401_NAME'],
      message: t('auth.token.refresh.require-token'),
    });
  }
  if (!await verify(refresh_token, process.env.NUXT_TOKEN_PASSWORD)) {
    throw createError({
      status: status.UNAUTHORIZED,
      statusMessage: status['401_NAME'],
      message: t('auth.token.expire.refresh-token-invalid'),
    });
  }
  const { payload } = decode<JwtPayload>(refresh_token)!;
  if (!payload?.id) {
    throw createError({
      status: status.UNAUTHORIZED,
      statusMessage: status['401_NAME'],
      message: t('auth.token.expire.refresh-token-invalid'),
    });
  }
  const { id } = payload;
  const redis = useRedis();
  if (!await redis.hasItem(refreshTokenNs(id))) {
    throw createError({
      status: status.UNAUTHORIZED,
      statusMessage: status['401_NAME'],
      message: t('auth.token.expire.refresh-token-invalid'),
    });
  }
  const accessTokenTTL = ms(process.env.NUXT_TOKEN_ACCESS_TOKEN_EXPIRES);
  const refreshTokenTTL = ms(process.env.NUXT_TOKEN_REFRESH_TOKEN_EXPIRES);

  const newAccessToken = await createToken(
    { id },
    'access_token',
    process.env.NUXT_TOKEN_PASSWORD,
    accessTokenTTL,
  );
  const newRefreshToken = await createToken(
    { id },
    'refresh_token',
    process.env.NUXT_TOKEN_PASSWORD,
    refreshTokenTTL,
  );

  const accessTokenNamespace = accessTokenNs(id);
  const refreshTokenNamespace = refreshTokenNs(id);

  await redis.setItem(accessTokenNamespace, access_token, { ttl: accessTokenTTL });
  await redis.setItem(refreshTokenNamespace, refresh_token, { ttl: refreshTokenTTL });

  await setUserSession(event, {
    user: { access_token: newAccessToken, refresh_token: newRefreshToken, id },
  });
  return { access_token: newAccessToken, refresh_token: newRefreshToken, id };
});

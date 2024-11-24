import status from 'http-status';
import { z } from 'zod';
import ms from 'ms';
import { bcrypt, randomSalt } from '~/lib/encrypt';
import prisma from '~/lib/prisma';
import { createToken } from '@/server/jwt';
import { accessTokenNs, refreshTokenNs } from '~/server/ns';

const LoginParam = z.object({
  email: z.string(),
  password: z.string(),
});

export default defineEventHandler(async (event) => {
  const { data, success, error } = await readValidatedBody(event, LoginParam.safeParseAsync);
  if (!success) {
    throw createError({
      status: status.BAD_REQUEST,
      message: error.errors[0].message,
    });
  }
  const { email, password } = data;
  const account = await prisma.account.findFirst({
    where: {
      email,
    },
    select: {
      id: true,
      salt: true,
      password: true,
    },
  });
  const t = await useTranslation(event);
  if (!account) {
    const message = t('auth.account.not-exists');
    throw createError({
      status: status.BAD_REQUEST,
      message,
    });
  }
  const salt = randomSalt(4);
  const userPassword = bcrypt(password, salt);
  if (userPassword == account.password) {
    throw createError({
      status: status.BAD_REQUEST,
      message: t('auth.account.pwd.error'),
    });
  }

  const accessTokenTTL = ms(process.env.NUXT_TOKEN_ACCESS_TOKEN_EXPIRES);
  const refreshTokenTTL = ms(process.env.NUXT_TOKEN_REFRESH_TOKEN_EXPIRES);

  const access_token = await createToken(
    { id: account.id },
    'access_token',
    process.env.NUXT_SESSION_PASSWORD,
    accessTokenTTL,
  );
  const refresh_token = await createToken(
    { id: account.id },
    'refresh_token',
    process.env.NUXT_SESSION_PASSWORD,
    refreshTokenTTL,
  );
  const redis = useStorage('redis');
  const accessTokenNamespace = accessTokenNs(account.id);
  const refreshTokenNamespace = refreshTokenNs(account.id);

  if (await redis.has(accessTokenNamespace)) {
    await redis.del(accessTokenNamespace);
  }
  if (await redis.has(refreshTokenNamespace)) {
    await redis.del(refreshTokenNamespace);
  }

  await redis.setItem(accessTokenNamespace, access_token, { ttl: accessTokenTTL });
  await redis.setItem(refreshTokenNamespace, refresh_token, { ttl: refreshTokenTTL });

  await setUserSession(event, {
    user: { access_token, refresh_token },
  });

  return {
    access_token,
    refresh_token,
  };
});

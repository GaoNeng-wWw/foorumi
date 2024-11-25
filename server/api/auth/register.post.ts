import status from 'http-status';
import ms from 'ms';
import { z } from 'zod';
import { bcrypt, randomSalt } from '~/lib/encrypt';
import prisma from '~/lib/prisma';
import { createToken } from '~/server/jwt';
import { accessTokenNs, refreshTokenNs } from '~/server/ns';
import { INVITE_NS, useRedis } from '~/server/utils';

export const RegisterDTO = z.object({
  email: z.string(),
  password: z.string(),
  inviteCode: z.optional(z.string()),
  bio: z.string(),
  nick: z.string(),
});
export default defineEventHandler(async (event) => {
  const { data, success, error } = await readValidatedBody(event, RegisterDTO.safeParseAsync);
  if (!success) {
    throw createError({
      status: status.BAD_REQUEST,
      message: error.errors[0].message,
    });
  }
  const { email, password, inviteCode, bio, nick } = data;
  const redis = useRedis();
  const { isPublic = false } = await redis.getItem<SiteMeta>('meta') ?? { isPublic: false };
  const t = await useTranslation(event);
  if (!isPublic && !inviteCode) {
    throw createError({
      status: status.FORBIDDEN,
      message: t('auth.account.block.reg'),
    });
  }
  let inviteTable = await redis.get<string[]>(INVITE_NS);
  if (!inviteTable) {
    await redis.set<string[]>(INVITE_NS, []);
    inviteTable = [];
  }
  if (!inviteTable.includes(inviteCode ?? '')) {
    throw createError({
      status: status.FORBIDDEN,
      message: t('auth.account.invite-code.error'),
    });
  }
  inviteTable = inviteTable.filter(code => code !== inviteCode);
  await redis.set(INVITE_NS, inviteTable);
  const dummyAccount = await prisma.account.findFirst({
    where: {
      email,
    },
  });
  if (dummyAccount) {
    throw createError({
      status: status.CONFLICT,
      message: t('auth.account.exists'),
    });
  }

  const salt = randomSalt(4);
  const safePassword = bcrypt(password, salt);

  const { id } = await prisma.account.create({
    select: {
      id: true,
    },
    data: {
      email,
      password: safePassword,
      salt,
      profile: {
        create: {
          name: nick,
          bio,
        },
      },
    },
  });

  const accessTokenTTL = ms(process.env.NUXT_TOKEN_ACCESS_TOKEN_EXPIRES);
  const refreshTokenTTL = ms(process.env.NUXT_TOKEN_REFRESH_TOKEN_EXPIRES);

  const access_token = await createToken(
    { id },
    'access_token',
    process.env.NUXT_SESSION_PASSWORD,
    accessTokenTTL,
  );
  const refresh_token = await createToken(
    { id },
    'refresh_token',
    process.env.NUXT_SESSION_PASSWORD,
    refreshTokenTTL,
  );
  const accessTokenNamespace = accessTokenNs(id);
  const refreshTokenNamespace = refreshTokenNs(id);

  if (await redis.has(accessTokenNamespace)) {
    await redis.del(accessTokenNamespace);
  }
  if (await redis.has(refreshTokenNamespace)) {
    await redis.del(refreshTokenNamespace);
  }

  await redis.setItem(accessTokenNamespace, access_token, { ttl: accessTokenTTL });
  await redis.setItem(refreshTokenNamespace, refresh_token, { ttl: refreshTokenTTL });
});

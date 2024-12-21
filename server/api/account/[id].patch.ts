import { Prisma } from '@prisma/client';
import status from 'http-status';
import { z } from 'zod';
import prisma from '~/lib/prisma';

const isIsoDate = (val: string) => /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(val);
export const PatchAccountParam = z.object({
  id: z.number({ coerce: true }),
});
export const PatchAccountBody = z.object({
  profile: z.object({
    name: z.string(),
    bio: z.string(),
  }),
  ban: z.boolean().optional().nullable(),
  reason: z.string().optional().nullable(),
  ban_expire: z.string().optional().nullable(),
  roleIds: z.array(z.number({ coerce: true })).optional().nullable(),
});

export default defineProtectedApi(async (event) => {
  const { routerParam } = await getRouteParam(event, PatchAccountParam);
  const { data } = await getBody(event, PatchAccountBody);
  const { profile, ban, reason, ban_expire, roleIds } = data;
  if (ban && (!ban_expire || !isIsoDate(ban_expire))) {
    throw createError({
      status: status.BAD_REQUEST,
      message: '过期时间不合法, 请确保是一个合法 的ISO 8601 时间字符串',
    });
  }
  const { id } = routerParam;
  const roles = roleIds
    ? await prisma.role.findMany({
      where: {
        id: {
          in: roleIds,
        },
      },
    })
    : undefined;
  try {
    return await prisma.account.update({
      where: {
        id,
      },
      select: {
        id: true,
        profile: {
          select: {
            name: true,
            bio: true,
            role: {
              select: {
                id: true,
                name: true,
                desc: true,
              },
            },
          },
        },
        ban: true,
        ban_expire: true,
        reason: true,
      },
      data: {
        ban: ban ?? undefined,
        ban_expire: !ban ? null : ban_expire,
        reason: !ban ? null : reason,
        profile: {
          update: {
            where: {
              account_id: id,
            },
            data: {
              name: profile.name,
              bio: profile.bio,
              role: roles
                ? {
                    set: roles,
                  }
                : undefined,
            },
          },
        },
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.message.includes('RecordNotFound')) {
      throw createError({
        status: status.NOT_FOUND,
        message: `${id}不存在`, // I18N
      });
    }
    throw createError({
      status: status.INTERNAL_SERVER_ERROR,
      message: (e as Error).message,
    });
  }
}, ['account::update']);

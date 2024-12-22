import status from 'http-status';
import { z } from 'zod';
import prisma from '~/lib/prisma';
import { PageQuery } from '~/server/utils/pagination';

export const ListAccountQuery = z.object({
  name: z.string().optional(),
}).merge(PageQuery);

export default defineProtectedApi(async (event) => {
  const { data, success, error } = await getValidatedQuery(event, ListAccountQuery.safeParseAsync);
  if (!success) {
    throw createError({
      status: status.BAD_REQUEST,
      statusMessage: status['400_CLASS'],
      message: error.issues[0].message,
    });
  }
  const { pagination: { size } } = useRuntimeConfig();
  const { page } = data;
  const accounts = await prisma.account.findMany({
    skip: size * (page - 1),
    take: size,
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
    where: {
      profile: {
        name: {
          contains: data.name,
        },
      },
    },
  });
  if (!accounts) {
    return {
      data: [],
      size,
      total: 0,
      end: true,
    };
  }
  const total = await prisma.account.count({
    where: {
      profile: {
        name: {
          contains: data.name,
        },
      },
    },
  });
  return {
    data: accounts,
    size,
    total,
    end: size * (page - 1) + size === total,
  };
}, ['account::list']);

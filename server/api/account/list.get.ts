import status from 'http-status';
import prisma from '~/lib/prisma';
import { PageQuery } from '~/server/utils/pagination';

export default defineProtectedApi(async (event) => {
  const { data, success, error } = await getValidatedQuery(event, PageQuery.safeParseAsync);
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
  });
  if (!accounts) {
    return {
      data: [],
      size,
      total: 0,
      end: true,
    };
  }
  const total = await prisma.account.count();
  return {
    data: accounts,
    size,
    total,
    end: size * (page - 1) + size === total,
  };
}, ['account::list']);

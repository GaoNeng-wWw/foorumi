import status from 'http-status';
import { z } from 'zod';
import prisma from '~/lib/prisma';

const GetPostListQuery = z.object({
  type: z.enum(['hot', 'new']).default('hot'),
  pin: z.boolean({ coerce: true }).default(false),
});

export default defineProtectedApi(async (event) => {
  const { data, success, error } = await getValidatedQuery(event, PageQuery.merge(GetPostListQuery).safeParseAsync);
  if (!success) {
    throw createError({
      status: status.BAD_REQUEST,
      message: error.issues[0].message,
    });
  }
  const { page, size, type } = data;
  const posts = await prisma.post.findMany({
    skip: (page - 1) * size,
    take: size,
    orderBy: {
      update_at: type === 'new' ? 'desc' : undefined,
      floors: type === 'hot' ? 'desc' : undefined,
    },
    select: {
      title: true,
      author: {
        select: {
          name: true,
        },
      },
      author_id: true,
      id: true,
      pin: true,
      floors: true,
    },
    where: {
      hidden: false,
      pin: data.pin,
    },
  });
  if (!posts.length) {
    return {
      data: [],
      total: 0,
      size,
    };
  }
  const count = await prisma.post.count({
    where: {
      hidden: false,
    },
  });
  return {
    data: posts,
    total: Math.ceil(count / size),
    size,
  };
}, ['post::list-load']);

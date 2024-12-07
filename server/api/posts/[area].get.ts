import status from 'http-status';
import { z } from 'zod';
import prisma from '~/lib/prisma';
import { POSTLIST_COUNT_NS } from '~/server/utils';

export const GetAreaPostList = z.object({
  pin: z.boolean().default(false),
  filter: z.enum(['hot', 'new']).default('new'),
});

export default defineProtectedApi(async (event) => {
  const areaId = getRouterParam(event, 'id', { decode: true });
  if (!areaId) {
    throw createError({
      status: status.BAD_REQUEST,
      message: `AreaId 不能为空`,
    });
  }
  if (Number.isNaN(Number.parseInt(areaId))) {
    throw createError({
      status: status.BAD_REQUEST,
      message: 'Area Id不合法',
    });
  }
  const postListNs = POSTLIST_COUNT_NS(Number.parseInt(areaId));
  const redis = useRedis();
  const total = await redis.getItem(postListNs);
  if (!total) {
    return {
      data: [],
      total: 0,
    };
  }
  const { data, success, error } = await getValidatedQuery(event, PageQuery.merge(GetAreaPostList).safeParseAsync);
  if (!success) {
    throw createError({
      status: status.BAD_REQUEST,
      message: error.issues[0].message,
    });
  }
  const { page, size } = data;
  const posts = await prisma.post.findMany({
    skip: Math.max((page - 1), 0) * size,
    take: size,
    where: {
      area: {
        id: Number.parseInt(areaId),
      },
    },
    select: {
      title: true,
      pin: data.pin,
      author: {
        select: {
          account_id: true,
          name: true,
        },
      },
      create_at: true,
      update_at: true,
    },
  });
  return {
    data: posts,
    total,
  };
});

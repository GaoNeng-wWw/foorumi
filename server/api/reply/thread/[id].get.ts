import status from 'http-status';
import { z } from 'zod';
import prisma from '~/lib/prisma';
import { THREAD_REPLY } from '~/server/utils';

const query = PageQuery.merge(z.object({
  floor: z.number({ coerce: true }),
}));

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id || Number.isNaN(Number.parseInt(id))) {
    throw createError({
      status: status.BAD_REQUEST,
      message: 'id不合法',
    });
  }
  const { data, error, success } = await getValidatedQuery(event, query.safeParseAsync);
  if (!success) {
    throw createError({
      status: status.BAD_REQUEST,
      message: error.issues[0].message,
    });
  }
  const { page, size, floor } = data;
  const rawThreadReplies = await prisma.threadReply.findMany({
    where: {
      parent: Number.parseInt(id),
      floor: floor,
    },
    orderBy: [{
      hot: 'desc',
    }, {
      create_at: 'desc',
    }],
    take: size,
    skip: (page - 1) * size,
    include: {
      author: {
        select: {
          profile: {
            select: {
              name: true,
              bio: true,
              account_id: true,
            },
          },
        },
      },
    },
  });
  const threadReplies = rawThreadReplies
    .map((thread) => {
      if (!thread.author.profile) {
        return null;
      }
      return {
        id: thread.id,
        author_id: thread.author_id,
        content: thread.content,
        author: {
          name: thread.author.profile.name,
          bio: thread.author.profile.bio,
        },
        updateAt: thread.update_at,
        createAt: thread.create_at,
        parent: thread.parent,
        hot: thread.hot.toString(),
        floor: thread.floor.toString(),
      };
    })
    .filter(val => val !== null);
  const redis = useRedis();
  const total = await redis.getItem<number>(THREAD_REPLY(Number.parseInt(id), floor)) ?? 0;
  return {
    data: threadReplies,
    size,
    total,
  };
});

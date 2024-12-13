import status from 'http-status';
import { z } from 'zod';

import prisma from '~/lib/prisma';
import { TRHEADS } from '~/server/utils';

export default defineProtectedApi(async (event) => {
  const { data, error, success } = await getValidatedQuery(event, PageQuery.merge(z.object({
    id: z.number({ coerce: true }),
    author: z.optional(z.number()),
  })).safeParseAsync);
  if (!success) {
    throw createError({
      status: status.BAD_REQUEST,
      message: error.issues[0].message,
    });
  }
  const { page, size } = data;
  const skip = (page - 1) * size;
  const id = data.id;
  const threads = await prisma.thread.findMany({
    where: {
      post: {
        id,
      },
      author_id: data.author,
    },
    select: {
      content: true,
      create_at: true,
      update_at: true,
      floor: true,
      author: {
        include: {
          account: {
            select: {
              id: true,
              profile: {
                select: {
                  name: true,
                  bio: true,
                },
              },
            },
          },
        },
      },
    },
    skip,
    take: size,
    orderBy: {
      create_at: 'asc',
    },
  });
  if (!threads.length) {
    return {
      data: [],
      total: 0,
      size,
    };
  }
  const ret = threads.filter(thread => thread.author !== null).map((thread) => {
    return {
      content: thread.content,
      create_at: thread.create_at,
      update_at: thread.update_at,
      author: flatAuthor(thread.author),
      floor: thread.floor.toString(),
    };
  });
  const redis = useRedis();
  let cnt = Number.parseInt(await redis.getItem(TRHEADS(id)) ?? '0');
  if (data.author) {
    cnt = await prisma.thread.count({
      where: {
        post: {
          id,
        },
        author_id: data.author,
      },
    });
  }
  return {
    data: ret,
    total: cnt,
    size,
  };
});
type NestAuthor = {
  account: {
    id: number;
  };
  name: string;
  bio: string;
};
type FlatAuthor = {
  id: number;
  name: string;
  bio: string;
};
function flatAuthor(author: NestAuthor): FlatAuthor {
  return {
    id: author.account.id,
    name: author.name,
    bio: author.bio,
  };
}

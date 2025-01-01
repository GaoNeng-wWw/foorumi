import status from 'http-status';
import { z } from 'zod';

import { flatAuthor } from './utils/flat-author';
import prisma from '~/lib/prisma';
import { HIDDEN_THREADS, TRHEADS } from '~/server/utils';

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
  const canGetHiddenThread = event.context.user.permissions.includes('thread::list::hidden');
  const threads = await prisma.thread.findMany({
    where: {
      post: {
        id,
      },
      author_id: data.author,
    },
    select: {
      id: true,
      content: true,
      create_at: true,
      update_at: true,
      floor: true,
      hidden: true,
      reason: true,
      Files: {
        select: {
          id: true,
          hash: true,
          rawName: true,
          createAt: true,
          updateAt: true,
        },
      },
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
      data: {
        title: '',
        threads: [],
      },
      total: 0,
      size,
    };
  }
  const { title } = await prisma.post.findFirst({
    where: {
      id,
    },
    select: {
      title: true,
    },
  }) ?? { title: '' };
  const ret = threads.filter(thread => thread.author !== null).map((thread) => {
    return {
      content: thread.hidden && !canGetHiddenThread ? '' : thread.content,
      create_at: thread.create_at,
      update_at: thread.update_at,
      author: flatAuthor(thread.author),
      floor: thread.floor.toString(),
      id: thread.id,
      hidden: thread.hidden,
      reason: thread.reason,
      files: thread.Files,
    };
  });
  const redis = useRedis();
  let cnt = Number.parseInt(await redis.getItem(TRHEADS(id)) ?? '0');
  const hidden_cnt = Number.parseInt(await redis.getItem(HIDDEN_THREADS(id)) ?? '0');
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
    data: {
      title,
      threads: ret,
    },
    total: canGetHiddenThread ? hidden_cnt + cnt : hidden_cnt > cnt ? 0 : Math.abs(hidden_cnt - cnt),
    size,
  };
}, ['thread::list', 'thread::list::hidden']);

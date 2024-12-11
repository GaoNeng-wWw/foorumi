import { z } from 'zod';
import { filterXSS } from 'xss';
import status from 'http-status';
import prisma from '~/lib/prisma';
import { TRHEADS } from '~/server/utils';

export const SendThread = z.object({
  postId: z.number({ coerce: true }),
  content: z.string().min(1),
});

export default defineProtectedApi(async (event) => {
  const { data, error, success } = await readValidatedBody(event, SendThread.safeParseAsync);
  if (!success) {
    throw createError({
      status: status.BAD_REQUEST,
      message: error.issues[0].message,
    });
  }
  const content = filterXSS(data.content);
  const postId = data.postId;
  const { user: { id } } = event.context;
  const profile = await prisma.profile.findFirst({
    where: {
      account_id: id,
    },
  });
  if (!profile) {
    throw createError({
      status: status.BAD_REQUEST,
      message: '用户不存在',
    });
  }

  const targetPost = await prisma.post.findFirst({
    where: {
      id: postId,
    },
  });

  if (!targetPost) {
    throw createError({
      status: status.BAD_REQUEST,
      message: '帖子不存在',
    });
  }

  const thread = await prisma.thread.create({
    data: {
      content,
      author: {
        connect: {
          ...profile,
        },
      },
      post: {
        connect: targetPost,
      },
    },
    select: {
      content: true,
      author: {
        select: {
          account_id: true,
          name: true,
          bio: true,
        },
      },
      create_at: true,
      update_at: true,
      id: true,
    },
  });
  const redis = useRedis();
  const key = TRHEADS(postId);
  const counter = await redis.getItem(key);
  if (!counter) {
    await redis.setItem(key, 1);
  } else {
    await redis.setItem(key, Number.parseInt(counter.toString() ?? '1') + 1);
  }
  return {
    id: thread.id,
    content: thread.content,
    author: {
      name: thread.author.name,
      bio: thread.author.bio,
      id: thread.author.account_id,
    },
  };
}, ['post::create']);

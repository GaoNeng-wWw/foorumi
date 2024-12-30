import { z } from 'zod';
import { filterXSS } from 'xss';
import status from 'http-status';
import type { Prisma } from '@prisma/client';
import prisma from '~/lib/prisma';
import { TRHEADS } from '~/server/utils';

export const SendThread = z.object({
  postId: z.number({ coerce: true }),
  content: z.string().min(1),
  files: z.string().array().optional(),
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

  const redis = useRedis();
  const key = TRHEADS(postId);
  const counter = await redis.getItem(key);
  const cnt = !counter ? 1 : Number.parseInt(counter.toString() ?? '1') + 1;
  await redis.setItem(key, cnt);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createThreadQueue: Prisma.Prisma__FilesClient<any, never, any>[] = [];

  const thread = await prisma.thread.create({
    data: {
      content: filterXSS(content),
      author: {
        connect: {
          ...profile,
        },
      },
      post: {
        connect: targetPost,
      },
      floor: cnt,
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
      floor: true,
    },
  });
  if (data.files) {
    data.files.forEach((fileHash) => {
      const handle = prisma.files.create({
        data: {
          thread: {
            connect: thread,
          },
          uploader: {
            connect: profile,
          },
          hash: fileHash,
        },
      });
      createThreadQueue.push(handle);
    });
  }
  await prisma.$transaction(createThreadQueue);
  return {
    id: thread.id,
    content: thread.content,
    author: {
      name: thread.author.name,
      bio: thread.author.bio,
      id: thread.author.account_id,
    },
    floor: thread.floor.toString(),
  };
}, ['post::create']);

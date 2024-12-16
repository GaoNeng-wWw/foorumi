import status from 'http-status';
import { z } from 'zod';
import prisma from '~/lib/prisma';
import { THREAD_REPLY } from '~/server/utils';

const ThreadReplyParam = z.object({
  id: z.number({ coerce: true }),
});
const ThreadReplyBody = z.object({
  content: z.string().min(1),
  floor: z.string(),
});

export default defineProtectedApi(async (event) => {
  const { data: paramData, success, error } = await getValidatedRouterParams(event, ThreadReplyParam.safeParseAsync);
  if (!success) {
    throw createError({
      status: status.BAD_REQUEST,
      message: error.issues[0].message,
    });
  }
  const { id } = paramData;
  const thread = await prisma.thread.findFirst({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });
  if (!thread) {
    throw createError({
      status: status.NOT_FOUND,
      message: '帖子不见了',
    });
  }

  const { data: bodyData, success: bodySuccess, error: bodyError } = await readValidatedBody(event, ThreadReplyBody.safeParseAsync);
  if (!bodySuccess) {
    throw createError({ status: status.BAD_REQUEST, message: bodyError.issues[0].message });
  }

  const account = await prisma.account.findFirst({
    where: { id: event.context.user.id },
  });
  if (!account) {
    throw createError({
      status: status.UNAUTHORIZED,
      message: '用户未登录',
    });
  }

  const threadReply = await prisma.threadReply.create({
    data: {
      author: {
        connect: account,
      },
      content: filterXSS(bodyData.content),
      parent: id,
      floor: BigInt(bodyData.floor),
    },
    select: {
      id: true,
      author_id: true,
      content: true,
      author: {
        select: {
          profile: {
            select: {
              name: true,
              bio: true,
            },
          },
        },
      },
      update_at: true,
      create_at: true,
      parent: true,
      hot: true,
      floor: true,
    },
  });

  const redis = useRedis();
  const cnt = Number.parseInt(await redis.getItem(THREAD_REPLY(id, Number.parseInt(bodyData.floor))) ?? '1');
  await redis.setItem(THREAD_REPLY(id, Number.parseInt(bodyData.floor)), cnt + 1);
  return {
    id: threadReply.id,
    author_id: threadReply.author_id,
    content: threadReply.content,
    author: {
      name: threadReply.author.profile!.name,
      bio: threadReply.author.profile!.bio,
    },
    updateAt: threadReply.update_at,
    createAt: threadReply.create_at,
    parent: threadReply.parent,
    hot: threadReply.hot.toString(),
    floor: threadReply.floor.toString(),
  };
}, ['reply::create']);

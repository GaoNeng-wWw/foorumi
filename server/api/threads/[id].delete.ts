import status from 'http-status';
import { z } from 'zod';
import prisma from '~/lib/prisma';
import { HIDDEN_THREADS, incr } from '~/server/utils';

const DeleteThreadParam = z.object({
  id: z.number({ coerce: true }),
});

const DeleteThreadBody = z.object({
  reason: z.string().optional().default(''),
});

export default defineProtectedApi(async (event) => {
  const { data: paramData, success: paramSuccss, error: paramError } = await getValidatedRouterParams(event, DeleteThreadParam.safeParseAsync);
  if (!paramSuccss) {
    throw createError({
      status: status.BAD_REQUEST,
      message: paramError.issues[0].message,
    });
  }
  const { data, success, error } = await readValidatedBody(event, DeleteThreadBody.safeParseAsync);
  if (!success) {
    throw createError({
      status: status.BAD_REQUEST,
      message: error.issues[0].message,
    });
  }
  const { user: { permissions, id } } = event.context;
  const thread = await prisma.thread.findFirst({
    where: {
      id: paramData?.id,
    },
    include: {
      author: true,
    },
  });
  if (thread?.author.account_id !== id && !permissions.includes('*')) {
    throw createError({
      status: status.FORBIDDEN,
      message: '你不能删除其他人的帖子',
    });
  }
  await prisma.thread.update({
    where: {
      id: paramData.id,
    },
    data: {
      hidden: true,
      reason: data.reason,
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
      hidden: true,
      reason: true,
    },
  });
  await incr(
    HIDDEN_THREADS(id),
  );
  return;
}, ['thread::hidden::self', 'thread::hidden::other']);

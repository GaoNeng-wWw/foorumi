import status from 'http-status';
import { z } from 'zod';
import prisma from '~/lib/prisma';

const PatchThreadParam = z.object({
  id: z.number({ coerce: true }),
});
const PatchThread = z.object({
  content: z.string().optional(),
  hidden: z.boolean().optional(),
});

export default defineProtectedApi(async (event) => {
  const { data: param, error: paramError, success: paramSuccess } = await getValidatedRouterParams(event, PatchThreadParam.safeParseAsync);
  if (!paramSuccess) {
    throw createError({
      status: status.BAD_REQUEST,
      message: paramError.issues[0].message,
    });
  }
  const { data, error, success } = await readValidatedBody(event, PatchThread.safeParseAsync);

  if (!success) {
    throw createError({
      status: status.BAD_REQUEST,
      message: error.issues[0].message,
    });
  }
  const { id } = param;
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
      status: status.BAD_REQUEST,
      message: 'Thread不存在',
    });
  }

  await prisma.thread.update({
    where: {
      id,
    },
    data: {
      content: data.content || undefined,
      hidden: data.hidden,
    },
  });
  return;
}, ['thread::update::other', 'thread::update::self']);

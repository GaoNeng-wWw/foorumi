import status from 'http-status';
import { z } from 'zod';
import prisma from '~/lib/prisma';

export const CreatePost = z.object({
  title: z.string(),
  content: z.string(),
  area_id: z.number({ coerce: true }),
});

export default defineProtectedApi(async (ctx) => {
  const { data, success, error } = await readValidatedBody(ctx, CreatePost.safeParseAsync);
  if (!success) {
    throw createError({
      status: status.BAD_REQUEST,
      message: error.issues[0].message,
    });
  }
  const { title, content, area_id } = data;
  const { context: { user: { id } } } = ctx;
  const account = await prisma.account.findFirst({
    where: { id },
    select: {
      profile: true,
    },
  });
  if (!account?.profile) {
    throw createError({
      status: status.BAD_REQUEST,
      message: '用户不存在',
    });
  }
  const { profile } = account;
  const area = await prisma.area.findFirst({
    where: {
      id: area_id,
    },
  });
  if (!area) {
    throw createError({
      status: status.BAD_REQUEST,
      message: '板区不存在',
    });
  }
  const post = await prisma.post.create({
    data: {
      title: title,
      content: '',
      pin: false,
      author: {
        connect: profile,
      },
      area: {
        connect: area,
      },
      threads: {
        create: {
          author: {
            connect: profile,
          },
          content: filterXSS(content),
          floor: 1,
        },
      },
    },
  });
  const redis = useRedis();
  await redis.setItem(TRHEADS(post.id), 1);
  return post;
});

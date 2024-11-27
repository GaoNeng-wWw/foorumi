import status from 'http-status';
import prisma from '~/lib/prisma';

export default defineProtectedApi(async (event) => {
  const { id } = event.context.user;
  const profile = await prisma.profile.findFirst({
    where: {
      account_id: id,
    },
    select: {
      account: false,
      id: false,
      post: false,
      thread: false,
      reply: false,
      role: {
        include: {
          permission: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
      name: true,
      bio: true,
    },
  });
  if (!profile) {
    throw createError({
      status: status.BAD_REQUEST,
      statusMessage: status[status.BAD_REQUEST],
      message: 'Invalid Account',
    });
  }
  return profile;
}, ['profile::get']);

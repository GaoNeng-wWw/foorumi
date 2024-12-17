import status from 'http-status';
import prisma from '~/lib/prisma';

export default defineProtectedApi(async (event) => {
  const paramId = getRouterParam(event, 'id');
  const profile = await prisma.profile.findFirst({
    where: {
      account_id: Number.parseInt(`${paramId}`),
    },
    select: {
      account: false,
      id: false,
      post: false,
      thread: false,
      role: {
        select: {
          name: true,
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
      account_id: true,
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

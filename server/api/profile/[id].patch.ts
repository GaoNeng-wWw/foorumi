import status from 'http-status';
import { z } from 'zod';
import prisma from '~/lib/prisma';

const patchBody = z.object({
  name: z.string().min(1).optional(),
  bio: z.string().optional(),
  role: z.array(z.number()).optional(),
  avatar: z.instanceof(File).optional(),
});

export default defineProtectedApi(async (event) => {
  const { id: _id = 'nan' } = getRouterParams(event);
  const id = Number.parseInt(_id);
  if (!_id || Number.isNaN(id)) {
    throw createError({
      status: status.NOT_FOUND,
      message: '用户不存在',
    });
  }
  const { data, error, success } = await readValidatedBody(event, patchBody.safeParseAsync);
  if (!success) {
    throw createError({
      status: status.BAD_REQUEST,
      message: error.issues[0].message,
    });
  }
  const { name, bio, role } = data;
  const { id: userId, permissions } = event.context.user;
  if (role && !permissions.includes('profile::update::other')) {
    throw createError({
      status: status.FORBIDDEN,
      message: '你没有权限修改用户的角色',
    });
  }
  if (!permissions.includes('profile::update::other') && id !== userId) {
    throw createError({
      status: status.FORBIDDEN,
      message: '你没有权限修改用户的个人信息',
    });
  }
  const roles = (role && role.length > 0)
    ? await prisma.role.findMany({
      where: {
        id: {
          in: role ?? [],
        },
      },
    })
    : [];
  const profile = prisma.profile.update({
    where: {
      id,
    },
    data: {
      name: name || undefined,
      bio: bio || undefined,
      role: {
        connect: roles,
      },
    },
    select: {
      account: false,
      id: false,
      post: false,
      thread: false,
      name: true,
      bio: true,
      account_id: true,
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
    },
  });
  return profile!;
}, ['profile::update::other', 'profile::update::self']);

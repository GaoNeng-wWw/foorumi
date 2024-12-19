import status from 'http-status';
import { z } from 'zod';
import prisma from '~/lib/prisma';

export default defineProtectedApi(async (event) => {
  const { routerParam } = await getRouteParam(event, z.object({
    id: z.number({ coerce: true }),
  }));
  if (await prisma.role.count() === 1) {
    throw createError({
      status: status.BAD_REQUEST,
      // TODO: I18N
      message: '你不能删除这个角色, 因为这是唯一的一个角色',
    });
  }
  const _role = await prisma.role.findFirst({
    where: {
      id: routerParam.id,
    },
    select: {
      profile: {
        take: 1,
      },
    },
  });
  if (_role?.profile[0]) {
    const roleUser = _role.profile[0].name;
    throw createError({
      status: status.BAD_REQUEST,
      // TODO: I18N
      message: `你不能删除这个角色, 因为这个角色下存在用户:${roleUser}`,
    });
  }
  const role = await prisma.role.delete({
    where: {
      id: routerParam.id,
    },
  });
  return role;
}, ['role::remove']);

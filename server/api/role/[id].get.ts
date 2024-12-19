import status from 'http-status';
import prisma from '~/lib/prisma';

export default defineProtectedApi(async (event) => {
  const _id = getRouterParam(event, 'id');
  if (!_id || (!event.context.user.permissions.includes('role::info::get') && !event.context.user.permissions.includes('*'))) {
    throw createError({
      status: status.FORBIDDEN,
      message: '你没有获取角色详细信息的权限', // TODO: I18N
    });
  }
  return await prisma.role.findFirst({
    where: {
      id: Number.parseInt(_id),
    },
    include: { permission: true },
  });
}, ['role::info::get']);

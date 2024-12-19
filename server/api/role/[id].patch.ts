import { z } from 'zod';
import status from 'http-status';
import { CreateRoleDTO } from './index.post';
import prisma from '~/lib/prisma';

export const PatchRoleDTO = CreateRoleDTO.partial();

export default defineProtectedApi(async (event) => {
  const { data } = await getBody(event, PatchRoleDTO);
  const { routerParam } = await getRouteParam(event, z.object({
    id: z.number({ coerce: true }),
  }));
  const role = await prisma.role.findFirst({
    where: {
      id: routerParam.id,
    },
  });
  if (!role) {
    throw createError({
      status: status.NOT_FOUND,
      message: '角色不存在', // TODO: I18
    });
  }
  const permissions = data.permissionIds
    ? await prisma.permission.findMany({
      where: {
        id: {
          in: data.permissionIds,
        },
      },
    })
    : [];
  const newRole = await prisma.role.update({
    where: {
      id: routerParam.id,
    },
    data: {
      name: data.name,
      desc: data.desc,
      permission: data.permissionIds
        ? {
            set: [...permissions.map(p => ({ id: p.id }))],
          }
        : undefined,
    },
  });
  return newRole;
}, ['role::remove']);

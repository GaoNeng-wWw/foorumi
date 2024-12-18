import { z } from 'zod';
import status from 'http-status';
import { CreatePermissionDTO } from './index.post';
import prisma from '~/lib/prisma';

export const PatchPermissionDTO = CreatePermissionDTO.partial();
export const PatchPermissionParam = z.object({
  id: z.number({ coerce: true }),
});

export default defineProtectedApi(async (event) => {
  const { routerParam } = await getRouteParam(event, PatchPermissionParam);
  const { data } = await getBody(event, PatchPermissionDTO);
  const permission = await prisma.permission.findFirst({
    where: {
      id: routerParam.id,
    },
  });
  if (!permission) {
    throw createError({
      status: status.BAD_REQUEST,
      message: '权限字段不存在',
    });
  }
  return await prisma.permission.update({
    where: {
      id: routerParam.id,
    },
    data: {
      name: data.name,
      desc: data.desc,
    },
  });
}, ['permission::update']);

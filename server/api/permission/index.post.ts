import status from 'http-status';
import { z } from 'zod';
import prisma from '~/lib/prisma';

export const CreatePermissionDTO = z.object({
  name: z.string(),
  desc: z.string(),
});

export default defineProtectedApi(async (event) => {
  const { data } = await getBody(event, CreatePermissionDTO);
  const { name, desc } = data;
  const oldPermission = await prisma.permission.findFirst({
    where: {
      name,
    },
  });
  if (oldPermission) {
    throw createError({
      status: status.CONFLICT,
      message: '权限字段存在',
    });
  }
  return await prisma.permission.create({
    data: {
      name,
      desc,
    },
  });
}, ['permission::create']);

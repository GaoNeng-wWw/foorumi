import { z } from 'zod';
import prisma from '~/lib/prisma';
import { getBody } from '~/server/utils/getBody';

export const CreateRoleDTO = z.object({
  name: z.string().min(1),
  desc: z.string().optional(),
  permissionIds: z.array(z.number({ coerce: true })),
});
export default defineProtectedApi(async (event) => {
  const { data } = await getBody(event, CreateRoleDTO);
  const permissions = await prisma.permission.findMany({
    where: {
      id: {
        in: data.permissionIds,
      },
    },
  });
  const role = await prisma.role.create({
    data: {
      name: data.name,
      desc: data.desc ?? '',
      permission: {
        connect: permissions,
      },
    },
  });
  return role;
}, ['role::create']);

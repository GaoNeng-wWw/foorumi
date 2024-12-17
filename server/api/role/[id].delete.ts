import { z } from 'zod';
import prisma from '~/lib/prisma';

export default defineProtectedApi(async (event) => {
  const { routerParam } = await getRouteParam(event, z.object({
    id: z.number({ coerce: true }),
  }));
  const role = await prisma.role.delete({
    where: {
      id: routerParam.id,
    },
  });
  return role;
}, ['role::remove']);

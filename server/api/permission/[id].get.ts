import { z } from 'zod';
import prisma from '~/lib/prisma';

export default defineProtectedApi(async (event) => {
  const { routerParam: { id } } = await getRouteParam(event, z.object({
    id: z.number({ coerce: true }),
  }));
  const permission = await prisma.permission.findFirst({
    where: { id },
  });
  return permission;
}, ['permission::get']);

import { z } from 'zod';
import prisma from '~/lib/prisma';

export const GetAccountInfo = z.object({
  id: z.number({ coerce: true }),
});

export default defineProtectedApi(async (event) => {
  const { routerParam: { id } } = await getRouteParam(event, GetAccountInfo);
  return await prisma.account.findFirst({
    where: {
      id,
    },
    select: {
      id: true,
      profile: {
        select: {
          name: true,
          bio: true,
          role: {
            select: {
              id: true,
              name: true,
              desc: true,
            },
          },
        },
      },
      ban: true,
      ban_expire: true,
      reason: true,
    },
  });
}, ['account::list']);

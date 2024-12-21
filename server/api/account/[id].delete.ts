import { z } from 'zod';
import prisma from '~/lib/prisma';

export const BanAccountParam = z.object({
  id: z.number({ coerce: true }),
});
export const BanAccountBody = z.object({
  reason: z.string(),
  end: z.string().datetime(),
});

export default defineProtectedApi(async (event) => {
  const { routerParam } = await getRouteParam(event, BanAccountParam);
  const { data } = await getBody(event, BanAccountBody);
  const account = await prisma.account.update({
    where: {
      id: routerParam.id,
    },
    data: {
      ban: {
        set: true,
      },
      ban_expire: new Date(data.end),
      reason: {
        set: data.reason,
      },
    },
  });
  return account;
}, ['account::ban']);

import { z } from 'zod';
import prisma from '~/lib/prisma';

export const PatchAccountParam = z.object({
  id: z.number({ coerce: true }),
});
export const PatchAccountBody = z.object({
  profile: z.object({
    name: z.string(),
    bio: z.string(),
  }),
  ban: z.boolean().optional(),
  reason: z.string().optional(),
  ban_expire: z.string().datetime().optional(),
  roleIds: z.array(z.number({ coerce: true })).optional(),
});

export default defineProtectedApi(async (event) => {
  const { routerParam } = await getRouteParam(event, PatchAccountParam);
  const { data } = await getBody(event, PatchAccountBody);
  const { profile, ban, reason, ban_expire, roleIds } = data;
  const { id } = routerParam;
  const roles = await prisma.role.findMany({
    where: {
      id: {
        in: roleIds,
      },
    },
  });
  return await prisma.account.update({
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
    data: {
      ban,
      ban_expire,
      reason,
      profile: {
        update: {
          where: {
            account_id: id,
          },
          data: {
            name: { set: profile.name },
            bio: { set: profile.bio },
            role: { set: roles },
          },
        },
      },
    },
  });
}, ['account::update']);

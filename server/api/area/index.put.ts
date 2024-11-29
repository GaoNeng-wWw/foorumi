import { z } from 'zod';
import prisma from '~/lib/prisma';

export const CreateArea = z.object({
  name: z.string(),
  parent: z.optional(z.number()),
});

export default defineProtectedApi(async (event) => {
  const { data, success } = await readValidatedBody(event, CreateArea.safeParseAsync);
  if (!success) {
    // TODO
    return;
  }
  const manager_id = event.context.user.id;
  const { parent, name } = data;
  const account = await prisma.account.findFirst({
    where: {
      id: manager_id,
    },
    select: {
      profile: true,
    },
  });
  if (!account?.profile) {
    // TODO: user not exists
    return;
  }
  const { profile } = account;
  const area = await prisma.area.create({
    data: {
      name,
      manager: {
        connect: profile,
      },
      parent,
      post: {
        create: [],
      },
    },
  });
  return area;
}, ['area::create']);

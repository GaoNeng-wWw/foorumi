import status from 'http-status';
import { z } from 'zod';
import prisma from '~/lib/prisma';

export const CreateArea = z.object({
  name: z.string(),
  manager_id: z.optional(z.number()),
  parent: z.optional(z.number({ coerce: true })),
});

export default defineProtectedApi(async (event) => {
  const { data, success, error } = await readValidatedBody(event, CreateArea.safeParseAsync);
  if (!success) {
    // TODO
    return createError({
      status: status.BAD_REQUEST,
      statusMessage: status['400_NAME'],
      message: error.issues[0].message,
    });
  }
  const { manager_id, name } = data;
  const account = await prisma.account.findFirst({
    where: {
      id: manager_id,
    },
    select: {
      profile: true,
    },
  });
  if (!account?.profile) {
    return createError({
      status: status.NOT_FOUND,
      statusMessage: status['404_NAME'],
      message: 'ACCOUNT NOT FOUDN',
    });
  }
  const { profile } = account;
  try {
    const area = await prisma.area.create({
      data: {
        name,
        manager: {
          connect: profile,
        },
        parent: data.parent,
      },
      select: {
        id: true,
        manager_id: true,
        name: true,
      },
    });
    return area;
  } catch (e) {
    console.log(event.path);
    return e;
  }
}, ['area::create']);

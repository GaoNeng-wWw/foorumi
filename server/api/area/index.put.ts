import status from 'http-status';
import { z } from 'zod';
import prisma from '~/lib/prisma';

export const CreateArea = z.object({
  name: z.string(),
  manager_id: z.optional(z.number()),
  parent: z.nullable(z.number({ coerce: true })).default(null),
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
        name: true,
        parent: true,
        manager: {
          select: {
            id: true,
            name: true,
          },
        },
        manager_id: true,
        id: true,
      },
    });
    return area;
  } catch (e) {
    console.log(event.path);
    return e;
  }
}, ['area::create']);

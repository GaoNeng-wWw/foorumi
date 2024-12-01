import status from 'http-status';
import { z } from 'zod';
import prisma from '~/lib/prisma';

export const UpdateAreaQuery = z.object({
  id: z.number(),
});

export const Area = z.object({
  name: z.string(),
  parent: z.optional(z.number()),
  manager_id: z.optional(z.number()),
});

export default defineProtectedApi(async (ctx) => {
  const query = await getValidatedQuery(ctx, UpdateAreaQuery.safeParseAsync);
  if (!query.success) {
    // TODO: throw 400
    return;
  }
  const { success, data, error } = await readValidatedBody(ctx, Area.safeParseAsync);

  if (!success) {
    return createError({
      statusCode: status.BAD_REQUEST,
      message: error.issues[0].message,
    });
  }

  const area = await prisma.area.findFirst({
    where: {
      id: query.data.id,
      // manager_id: query.data.
    },
  });

  if (!area) {
    // throw 404
    return;
  }

  await prisma.area.update({
    where: {
      id: query.data.id,
    },
    data: {
      name: data.name,
      parent: data.parent,
      manager_id: data.manager_id,
    },
  });
}, ['area::update']);

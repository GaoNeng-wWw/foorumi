import status from 'http-status';
import { z } from 'zod';
import prisma from '~/lib/prisma';

export const UpdateAreaQuery = z.object({
  id: z.string({ coerce: true }),
});

export const Area = z.object({
  name: z.string(),
  parent: z.nullable(
    z.number(),
  ),
  manager_id: z.number(),
});

export default defineProtectedApi(async (ctx) => {
  const query = await getValidatedQuery(ctx, UpdateAreaQuery.safeParseAsync);
  if (!query.success) {
    // TODO: throw 400
    throw createError({
      statusCode: status.BAD_REQUEST,
      message: query.error.issues[0].message,
    });
  }
  const { success, data, error } = await readValidatedBody(ctx, Area.safeParseAsync);

  if (!success) {
    throw createError({
      statusCode: status.BAD_REQUEST,
      message: error.issues[0].message,
    });
  }

  const area = await prisma.area.findFirst({
    where: {
      id: Number.parseInt(query.data.id),
    },
  });

  if (!area) {
    throw createError({
      statusCode: status.NOT_FOUND,
      message: 'Area Not found',
    });
  }

  await prisma.area.update({
    where: {
      id: Number.parseInt(query.data.id),
    },
    data: {
      name: data.name,
      parent: data.parent,
      manager_id: data.manager_id,
    },
  });
}, ['area::update']);

import status from 'http-status';
import { z } from 'zod';
import prisma from '~/lib/prisma';

export const RemoveArea = z.object({
  id: z.number({ coerce: true }),
});

export default defineProtectedApi(async (event) => {
  const { data, success, error } = await getValidatedQuery(event, RemoveArea.safeParseAsync);
  if (!success) {
    // TODO: ...
    throw createError({
      status: status.BAD_REQUEST,
      message: error.issues[0].message,
    });
  }
  const { id } = data;
  const area = await prisma.area.findFirst({
    where: {
      id,
    },
  });
  if (!area) {
    // throw 404 error
    throw createError({
      statusCode: status.NOT_FOUND,
      message: 'Area not found',
    });
  }
  await prisma.area.delete({
    where: {
      id: area.id,
    },
  });
}, ['area::delete']);

import { z } from 'zod';
import prisma from '~/lib/prisma';

export const RemoveArea = z.object({
  id: z.number(),
});

export default defineEventHandler(async (event) => {
  const { data, success } = await getValidatedQuery(event, RemoveArea.safeParseAsync);
  if (!success) {
    // TODO: ...
    return;
  }
  const { id } = data;
  const area = await prisma.area.delete({
    where: {
      id,
    },
  });
  if (!area) {
    // throw 404 error
    return;
  }
});

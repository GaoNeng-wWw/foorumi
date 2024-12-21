import { z } from 'zod';
import prisma from '~/lib/prisma';

export const SearchRole = z.object({
  name: z.string(),
}).merge(
  PageQuery,
);

export default defineProtectedApi(async (event) => {
  const { routerParam } = await getRouteParam(event, SearchRole);
  const { name, page = 1, size = 20 } = routerParam;
  const take = size;
  const skip = (page - 1) * size;
  const searchCount = await prisma.role.count({
    where: {
      name: {
        contains: name,
      },
    },
  });
  const searchRes = await prisma.role.findMany({
    where: {
      name: {
        contains: name,
      },
    },
    skip,
    take,
  });
  return {
    data: searchRes,
    total: searchCount,
    size,
  };
}, ['role::query']);

import status from 'http-status';
import prisma from '~/lib/prisma';

export default defineProtectedApi(async (event) => {
  const { data, error, success } = await getValidatedQuery(event, PageQuery.safeParseAsync);
  if (!success) {
    throw createError({
      status: status.BAD_REQUEST,
      message: error.issues[0].message,
      statusMessage: status['400_NAME'],
    });
  }
  const totalAreas = await prisma.area.count();
  if (!totalAreas) {
    return {
      data: [],
      total: 0,
      end: true,
    };
  }
  const skip = (data.page - 1) * data.size;
  const take = data.size;
  const areas = await prisma.area.findMany({
    skip,
    take,
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
  return {
    data: areas,
    total: totalAreas,
    end: (skip + take) === totalAreas,
    pageSize: take,
  };
}, ['area::list']);

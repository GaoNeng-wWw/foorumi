import status from 'http-status';
import prisma from '~/lib/prisma';

export default defineProtectedApi(async (event) => {
  const { data, success, error } = await getValidatedQuery(event, PageQuery.safeParseAsync);
  if (!success) {
    throw createError({
      status: status.BAD_REQUEST,
      message: error.issues[0].message,
    });
  }
  const { page, size } = data;
  const skip = (page - 1) * size;
  const permissions = await prisma.permission.findMany({
    take: size,
    skip,
  });
  const permissionsTotal = await prisma.permission.count();
  return {
    data: permissions,
    total: permissionsTotal,
    size,
  };
}, ['permission::query']);
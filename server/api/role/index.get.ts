import status from 'http-status';
import prisma from '~/lib/prisma';

export default defineProtectedApi(async (event) => {
  const { data, error, success } = await getValidatedQuery(event, PageQuery.safeParseAsync);
  if (!success) {
    throw createError({
      status: status.BAD_REQUEST,
      message: error.issues[0].message,
    });
  }
  const { page, size } = data;
  const roles = await prisma.role.findMany({
    skip: (page - 1) * size,
    take: size,
  });
  const roleTotal = await prisma.role.count();
  return {
    data: roles,
    total: roleTotal,
    size,
  };
}, ['role::query']);

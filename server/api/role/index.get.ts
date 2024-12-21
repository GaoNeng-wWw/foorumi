import status from 'http-status';
import { z } from 'zod';
import prisma from '~/lib/prisma';

const GetRoleQuery = PageQuery.merge(
  z.object({
    all: z.boolean({ coerce: true }).optional(),
  }),
);

export default defineProtectedApi(async (event) => {
  const { data, error, success } = await getValidatedQuery(event, GetRoleQuery.safeParseAsync);
  if (!success) {
    throw createError({
      status: status.BAD_REQUEST,
      message: error.issues[0].message,
    });
  }
  if (data.all) {
    return await prisma.role.findMany({});
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

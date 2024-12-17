import type { H3Event } from 'h3';
import status from 'http-status';
import type { z } from 'zod';

export const getRouteParam = async <T>(
  event: H3Event,
  schema: z.ZodType<T>,
) => {
  const { data, error, success } = await getValidatedRouterParams(event, schema.safeParseAsync);
  if (!success) {
    throw createError({
      status: status.BAD_REQUEST,
      message: error.issues[0].message,
    });
  }
  return { routerParam: data, success, error };
};

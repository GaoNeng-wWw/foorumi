import type { H3Event } from 'h3';
import status from 'http-status';
import type { z } from 'zod';

export const getBody = async <
  T,
  Event extends H3Event = H3Event,
>(event: Event, validate: z.ZodType<T>) => {
  const body = await readBody(event);
  const { data, error, success } = await validate.safeParseAsync(body);
  if (!success) {
    throw createError({
      status: status.BAD_REQUEST,
      message: error.issues[0].message,
    });
  }
  return { data, error, success };
};

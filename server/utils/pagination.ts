import { z } from 'zod';

export const PageQuery = z.object({
  page: z.number({ coerce: true }).gt(0),
});
export const SizeSkipQuery = z.object({
  skip: z.number().gte(0),
  size: z.number().gte(0),
});

import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import status from 'http-status';
import { z } from 'zod';

export const GetThreadImageParam = z.object({
  hash: z.string().min(1),
});
export default defineProtectedApi(async (event) => {
  const { routerParam } = await getRouteParam(event, GetThreadImageParam);
  const { storage: { image } } = useRuntimeConfig(event);
  const imagePath = join(image, routerParam.hash);
  if (!existsSync(imagePath)) {
    throw createError({ statusCode: status.NOT_FOUND });
  }
  return send(event, readFileSync(imagePath), 'image/webp');
}, ['thread::list', 'thread::list::hidden']);

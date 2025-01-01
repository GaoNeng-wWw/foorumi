import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import status from 'http-status';
import { z } from 'zod';
import prisma from '~/lib/prisma';

export const GetFile = z.object({
  hash: z.string(),
});
export const GetFileQuery = z.object({
  meta: z.boolean({ coerce: true }).optional(),
});

export default defineProtectedApi(async (event) => {
  const { routerParam } = await getRouteParam(event, GetFile);
  const { query } = await readQuery(event, GetFileQuery);
  const { hash } = routerParam;
  const file = await prisma.files.findFirst({ where: { hash }, take: 1 });
  if (!file) {
    throw createError({
      status: status.NOT_FOUND,
      message: '资源不存在',
    });
  }
  const { storage: { file: fileBasePath } } = useRuntimeConfig(event);
  const path = join(fileBasePath, `${hash}`);
  if (!existsSync(path)) {
    throw createError({
      status: status.NOT_FOUND,
      message: '资源不存在',
    });
  }
  if (query.meta) {
    return {
      mime: file.mime,
      rawName: file.rawName,
    };
  }
  return send(event, readFileSync(path), file.mime);
}, ['file::get']);

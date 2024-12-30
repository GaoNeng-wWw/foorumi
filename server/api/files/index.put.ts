import { createHash } from 'crypto';
import { writeFileSync } from 'fs';
import { join } from 'path';
import status from 'http-status';

export default defineProtectedApi(async (event) => {
  const files = await readMultipartFormData(event);
  if (!files || !files.length) {
    return;
  }
  const file = files[0];
  const { filename, data } = file;
  const { storage: { file: fileBasePath }, storage_limit } = useRuntimeConfig(event);
  const md5 = createHash('md5').update(data).digest('hex');
  const realFileName = filename ?? md5;
  const path = join(fileBasePath, md5);
  if (data.byteLength > storage_limit) {
    throw createError({
      status: status.REQUESTED_RANGE_NOT_SATISFIABLE,
    });
  }
  writeFileSync(path, data);
  return realFileName;
}, ['file::put']);

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
  const path = join(fileBasePath, filename ?? md5);
  if (md5 !== (filename ?? md5)) {
    throw createError({
      status: status.BAD_REQUEST,
      message: '哈希值与服务器计算不一致',
    });
  }
  if (data.byteLength > storage_limit) {
    throw createError({
      status: status.REQUESTED_RANGE_NOT_SATISFIABLE,
    });
  }
  writeFileSync(path, data);
}, ['file::put']);

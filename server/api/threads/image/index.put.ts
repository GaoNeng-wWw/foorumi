import { createHash } from 'crypto';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

const BASE_URL = '/api/threads/image';

export default defineProtectedApi(async (event) => {
  const data = await readMultipartFormData(event);
  if (!data) {
    return [];
  }
  const images = data.filter(data => data.type?.includes('image'));
  if (!images.length) {
    return [];
  }
  const { storage: { image } } = useRuntimeConfig();
  const imagesPair = images
    .map((img) => {
      const md5 = createHash('md5').update(img.data).digest('hex');
      if (
        existsSync(
          join(image, md5),
        )
      ) {
        return [md5, null] as const;
      }
      return [md5 ?? Date.now().toString(), img.data] as const;
    })
    .map((pair) => {
      if (pair[1] === null) {
        const md5 = pair[0];
        const content = readFileSync(join(image, md5));
        return [md5, Promise.resolve(content)] as const;
      }
      return [
        pair[0],
        sharp(pair[1]).webp({ quality: 60 }).webp().toBuffer(),
      ] as const;
    });
  const iohandles = imagesPair.map((pair) => {
    const [name, buffer] = pair;
    return buffer.then((buf) => {
      return new Promise<string>((resolve, reject) => {
        try {
          writeFileSync(
            join(image, name),
            buf,
          );
          resolve(name);
        } catch (e) {
          reject(e);
        }
      });
    });
  });

  const ret = Promise.allSettled(iohandles)
    .then((results) => {
      return results.map((result) => {
        return {
          status: result.status === 'fulfilled' ? 'success' : 'fail',
          url: result.status === 'fulfilled' ? `${BASE_URL}/${result.value}` : '',
        } as const;
      });
    });
  return ret;
}, ['file::put', 'thread::add']);

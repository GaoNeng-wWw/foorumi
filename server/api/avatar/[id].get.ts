import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import status from 'http-status';
import { z } from 'zod';
import sharp from 'sharp';

export const GetAvatarParam = z.object({
  id: z.number({ coerce: true }),
});
export default defineProtectedApi(async (event) => {
  const { routerParam: { id } } = await getRouteParam(event, GetAvatarParam);
  const { storage: { avatar } } = useRuntimeConfig(event);
  const avatarPath = join(avatar, `avatar-${id}.webp`);
  const { storage: { avatar: avatarBasePath } } = useRuntimeConfig(event);
  if (!existsSync(join(avatarBasePath, `avatar-${id}`))) {
    throw createError({
      status: status.NOT_FOUND,
    });
  }
  const img = await sharp(
    join(avatarBasePath, `avatar-${id}`),
  )
    .webp({ quality: 75 })
    .resize(128, 128)
    .toBuffer();

  return send(event, img, 'image/webp');
  // return Array.from(img);
}, ['profile::get']);

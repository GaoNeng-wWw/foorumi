import { join } from 'path';
import status from 'http-status';
import { z } from 'zod';
import sharp from 'sharp';
import prisma from '~/lib/prisma';

export const GetAvatarParam = z.object({
  id: z.number({ coerce: true }),
});
export default defineProtectedApi(async (event) => {
  const { routerParam: { id } } = await getRouteParam(event, GetAvatarParam);
  const profile = await prisma.profile.findFirst({
    where: {
      account_id: id,
    },
    select: {
      avatar: true,
    },
  });
  if (!profile || !profile.avatar) {
    throw createError({
      status: status.NOT_FOUND,
    });
  }
  const { storage: { image } } = useRuntimeConfig(event);
  const img = await sharp(
    join(
      image, profile.avatar!,
    ),
  )
    .webp({ quality: 75 })
    .resize(128, 128)
    .toBuffer();

  return send(event, img, 'image/webp');
}, ['profile::get']);

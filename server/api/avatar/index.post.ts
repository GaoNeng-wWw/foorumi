import { existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';
import status from 'http-status';
import { z } from 'zod';
import prisma from '~/lib/prisma';

export const UpdateAvatarQuery = z.object({
  id: z.number({ coerce: true }),
});
export const UpdateAvatarBody = z.object({
  avatar: z.instanceof(File).optional(),
});
export default defineProtectedApi(async (event) => {
  const { id, permissions } = event.context.user;
  const { data: query, success, error } = await getValidatedQuery(event, UpdateAvatarQuery.safeParseAsync);
  if (!success) {
    throw createError({
      status: status.BAD_REQUEST,
      message: error.issues[0].message,
    });
  }
  const { id: queryId } = query;
  if (id !== queryId && !permissions.includes('profile::update::other')) {
    throw createError({
      status: status.FORBIDDEN,
      message: '你没有权限修改他人的头像',
    });
  }
  const formData = await readMultipartFormData(event);
  if (!formData) {
    return;
  }
  const avatar = formData[0];

  const { type } = avatar;
  if (!type || !type.startsWith('image')) {
    throw createError({
      status: status.BAD_REQUEST,
      message: '上传的不是合法图片',
    });
  }
  const size = avatar.data.byteLength;
  if ((size / (1024 * 1024)) > 5) {
    throw createError({
      status: status.BAD_REQUEST,
      message: '图片不能大于 5MB ',
    });
  }
  const { storage: { image } } = useRuntimeConfig(event);
  const hash = createHash('sha256');
  const sha256 = hash.update(avatar.data).digest('hex');
  const targetPath = join(image, sha256);
  if (!existsSync(targetPath)) {
    writeFileSync(
      targetPath,
      avatar.data,
    );
  }

  const transactionQueue = [];

  const updateProfile = prisma.profile.update({
    where: {
      account_id: id,
    },
    data: {
      avatar: {
        set: sha256,
      },
    },
  });
  transactionQueue.push(updateProfile);

  const oldAccountAvatar = await prisma.files.findFirst({
    where: {
      target_id: id,
      file_type: 'IMAGE',
      target_type: 'ACCOUNT',
    },
  });

  if (oldAccountAvatar) {
    const updateAvatarFile = prisma.files.update({
      where: {
        id: oldAccountAvatar.id,
      },
      data: {
        file_hash: sha256,
        file_type: 'IMAGE',
        target_id: id,
        target_type: 'ACCOUNT',
      },
    });
    transactionQueue.push(updateAvatarFile);
  } else {
    const addImageRefRecord = prisma.files.create({
      data: {
        file_hash: sha256,
        file_type: 'IMAGE',
        size: avatar.data.byteLength,
        target_id: id,
        target_type: 'ACCOUNT',
      },
    });
    transactionQueue.push(addImageRefRecord);
  }

  await prisma.$transaction(transactionQueue);

  return;
}, ['profile::update::other', 'profile::update::self']);

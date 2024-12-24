import { writeFileSync } from 'fs';
import { join } from 'path';
import status from 'http-status';
import { z } from 'zod';

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
  const { data } = await getBody(event, UpdateAvatarBody);
  const { avatar } = data;
  if (!avatar) {
    return;
  }
  const { type, size } = avatar;
  if (!type.startsWith('image')) {
    throw createError({
      status: status.FORBIDDEN,
      message: '上传的不是合法图片',
    });
  }
  if ((size / (1024 * 1024)) > 5) {
    throw createError({
      status: status.FORBIDDEN,
      message: '图片不能大于 5MB ',
    });
  }
  const { storage: { avatar: avatarPath } } = useRuntimeConfig(event);
  writeFileSync(
    join(avatarPath, `avatar-${id.toString()}`),
    Buffer.from(await avatar.arrayBuffer()),
  );
}, ['profile::update::other', 'profile::update::self']);

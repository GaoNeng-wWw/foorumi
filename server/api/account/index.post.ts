import status from 'http-status';
import { z } from 'zod';
import { bcrypt } from '~/lib/encrypt';
import { createErr } from '~/lib/error';
import prisma from '~/lib/prisma';

export const CreateToken = z.object({
  email: z.string(),
  password: z.string(),
});

export default defineEventHandler(async (event) => {
  const { data, success } = await readValidatedBody(event, CreateToken.safeParseAsync);
  if (!success) {
    return;
  }
  const { email, password } = data;
  const account = await prisma.account.findFirst({
    where: {
      email,
    },
    select: {
      salt: true,
      password: true,
    },
  });
  const t = await useTranslation(event);
  if (!account) {
    const msg = t('auth.account.pwd.error');
    return sendError(event, createErr(msg, status.BAD_REQUEST));
  }
  const bcyrptPassword = bcrypt(password, account.salt);
  if (bcyrptPassword !== account.password) {
    const msg = t('auth.account.pwd.error');
    return sendError(event, createErr(msg, status.BAD_REQUEST));
  }
  // token
  return;
});

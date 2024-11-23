import { z } from 'zod';
import { bcrypt, randomSalt } from '~/lib/encrypt';
import { createErr } from '~/lib/error';
import prisma from '~/lib/prisma';

const CreateAccount = z.object({
  email: z.string(),
  password: z.string(),
  name: z.string(),
  bio: z.string(),
});

export default defineEventHandler(async (event) => {
  const { data, success } = await readValidatedBody(event, CreateAccount.safeParseAsync);
  const t = await useTranslation(event);
  if (!success) {
    // ...
    return;
  }
  const { email, password, name, bio } = data;

  const accountDummy = await prisma.account.findFirst({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  if (accountDummy) {
    //
    return sendError(event, createErr(t('auth.account.exists')));
  }
  const salt = randomSalt(4);
  const pwd = bcrypt(password, salt);
  const safeAccount = await prisma.account.create({
    select: {
      email: true,
      id: true,
      profile: {
        select: {
          name: true,
        },
      },
    },
    data: {
      email,
      password: pwd,
      salt,
      profile: {
        create: {
          name,
          bio,
        },
      },
    },
  });
  return safeAccount;
});

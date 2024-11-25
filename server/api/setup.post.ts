import { z } from 'zod';
import status from 'http-status';
import { createErr } from '~/lib/error';
import prisma from '~/lib/prisma';
import { bcrypt, randomSalt } from '~/lib/encrypt';

export const SetupBody = z.object({
  adminEmail: z.string({ required_error: 'require admin email' }),
  adminUserName: z.string({ required_error: 'require admin user name' }),
  adminPassword: z.string({ required_error: 'require admin password' }),
  siteName: z.string({ required_error: 'site name should not to be empty' }),
  isPublic: z.optional(z.boolean()),
});

export default defineEventHandler(async (event) => {
  const storage = useStorage('redis');
  const lock = await storage.getItem('lock');
  if (lock) {
    return sendError(event, createErr('Lock exists', status.INTERNAL_SERVER_ERROR));
  }
  const { data, success, error } = await readValidatedBody(event, SetupBody.safeParseAsync);
  if (!success) {
    const [{ message }] = error.issues;
    return sendError(event, createErr(message, status.BAD_REQUEST));
  }
  const { adminUserName, adminPassword, adminEmail, siteName, isPublic } = data;

  const permissionDummy = await prisma.permission.findFirst({ take: 1 });
  const roleDummy = await prisma.role.findFirst({ take: 1 });
  if (permissionDummy || roleDummy) {
    return sendError(event, createErr('Database is not clean, please clear first!', status.INTERNAL_SERVER_ERROR));
  }
  const permission = await prisma.permission.create({
    data: {
      name: '*',
      desc: 'super permission',
    },
  });
  const role = await prisma.role.create({
    data: {
      name: 'Admin',
      desc: 'site admin',
      permission: {
        connect: permission,
      },
    },
  });
  const salt = randomSalt(4);
  const password = bcrypt(adminPassword, salt);
  const account = await prisma.account.create({
    data: {
      password,
      email: adminEmail,
      salt,
      profile: {
        create: {
          name: adminUserName,
          bio: '',
          role: {
            connect: role,
          },
        },
      },
    },
  });
  await storage.setItem('meta', { siteName, adminEmail, adminUserName, adminId: account.id, isPublic });
  await storage.setItem('lock', '1');
  return;
});

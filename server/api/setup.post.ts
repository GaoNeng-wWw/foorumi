import { consola } from 'consola';
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

const PERMISSIONS = [
  { name: '*', desc: '超级权限' },
  { name: 'area::create', desc: '创建一个区域' },
  { name: 'area::update', desc: '修改一个区域的信息' },
  { name: 'area::delete', desc: '删除一个区域' },
  { name: 'area::visit', desc: '访问区域' },
  { name: 'area::list', desc: '列出所有的区域' },
  { name: 'area::update::other', desc: '修改其他区域 (不是自己管理的区域)' },
  { name: 'post::create', desc: '创建一个帖子' },
  { name: 'post::update', desc: '修改一个帖子' },
  { name: 'post::hidden', desc: '隐藏一个帖子' },
  { name: 'post::visit', desc: '访问一个帖子' },
  { name: 'post::list-load', desc: '加载帖子列表' },
  { name: 'comment::create', desc: '在一个帖子下创建一个评论' },
  { name: 'comment::hidden::self', desc: '隐藏自己的评论' },
  { name: 'comment::hidden::other', desc: '隐藏其他人的评论' },
  { name: 'comment::update::self', desc: '修改自己的评论' },
  { name: 'comment::update::other', desc: '修改他人的评论' },
  { name: 'account::create', desc: '强制创建一个账号' },
  { name: 'account::hidden', desc: '强制隐藏一个账号' },
  { name: 'account::ban', desc: '强制阻止一个账号登陆' },
  { name: 'account::update', desc: '强制修改一个账号' },
  { name: 'account::list', desc: '列出所有账号' },
  { name: 'thread::add', desc: '跟帖' },
  { name: 'thread::update::self', desc: '修改自己发布的跟贴内容' },
  { name: 'thread::update::other', desc: '修改他人发布的跟贴内容' },
  { name: 'thread::hidden::self', desc: '隐藏自己的跟贴内容' },
  { name: 'thread::hidden::other', desc: '隐藏他人的跟贴内容' },
  { name: 'thread::list', desc: '列出跟帖内容' },
  { name: 'thread::list::hidden', desc: '列出隐藏的thread' },
  { name: 'profile::get', desc: '获取公开个人信息' },
  { name: 'profile::update::self', desc: '修改自己的个人信息' },
  { name: 'profile::update::other', desc: '修改他人的个人信息' },
  { name: 'reply::create', desc: '创建一个回复' },
  { name: 'reply::query', desc: '展开回复' },
  { name: 'role::create', desc: '创建一个角色' },
  { name: 'role::remove', desc: '删除一个角色' },
  { name: 'role::update', desc: '更新一个角色' },
  { name: 'role::query', desc: '获取角色' },
  { name: 'role::info::get', desc: '获取角色详细信息' },
  { name: 'permission::create', desc: '创建一个权限' },
  { name: 'permission::remove', desc: '删除一个权限' },
  { name: 'permission::update', desc: '修改一个权限' },
  { name: 'permission::query', desc: '查询权限列表' },
  { name: 'permission::get', desc: '获取权限详细信息' },
] as const;

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
  const salt = randomSalt(4);
  const password = bcrypt(adminPassword, salt);

  for (const { name, desc } of PERMISSIONS) {
    try {
      await prisma.permission.create({
        data: {
          name,
          desc,
        },
      });
      consola.trace(`Add ${name} success`);
    } catch (e) {
      consola.error(e);
    }
  }
  const p = await prisma.permission.findFirst({
    where: {
      name: '*',
    },
  });
  const role = await prisma.role.create({
    data: {
      name: 'Admin',
      desc: 'site admin',
      permission: {
        connect: p!,
      },
    },
  });
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

// import type { NitroFetchRequest, NitroFetchOptions } from 'nitropack/types';
declare interface AppState {
  drawer: boolean;
}
declare interface ApiCommonError {
  statusCode: number;
  stack: unknown[];
  data: {
    status: number;
    error: string;
  };
}

declare interface SiteMeta {
  siteName: string;
  siteLogo: never; // not implment
  isPublic: boolean;
}

declare type UnRef<T> = T extends Ref<infer P> ? P : unknown;

declare interface Area {
  id: number;
  name: string;
  manager_id: number;
  parent: number | null;
  manager: {
    name: string;
  };
}

declare interface JwtPayload {
  id: number;
}

declare namespace NodeJS {
  interface ProcessEnv {
    NUXT_TOKEN_PASSWORD: string;
    NUXT_TOKEN_ACCESS_TOKEN_EXPIRES: string;
    NUXT_TOKEN_REFRESH_TOKEN_EXPIRES: string;
    NUXT_SESSION_PASSWORD: string;
  }
}

declare type PermissionTable =
  // 创建一个区域
  | 'area::create'
  // 修改一个区域的信息
  | 'area::update'
  // 删除一个区域
  | 'area::delete'
  // 访问区域
  | 'area::visit'
  // 列出所有的区域
  | 'area::list'
  // 修改其他区域 (不是自己管理的区域)
  | 'area::update::other'
  // 创建一个帖子
  | 'post::create'
  // 修改一个帖子
  | 'post::update'
  // 隐藏一个帖子
  | 'post::hidden'
  // 访问一个帖子
  | 'post::visit'
  // 加载帖子列表
  | 'post::list-load'
  // 在一个帖子下创建一个评论
  | 'comment::create'
  // 隐藏自己的评论
  | 'comment::hidden::self'
  // 隐藏其他人的评论
  | 'comment::hidden::other'
  // 修改自己的评论
  | 'comment::update::self'
  // 修改他人的评论
  | 'comment::update::other'
  // 强制创建一个账号
  | 'account::create'
  // 强制隐藏一个账号
  | 'account::hidden'
  // 强制阻止一个账号登陆
  | 'account::ban'
  // 强制修改一个账号
  | 'account::update'
  // 列出所有账号
  | 'account::list'
  // 跟帖
  | 'thread::add'
  // 修改自己发布的跟贴内容
  | 'thread::update::self'
  // 修改他人发布的跟贴内容
  | 'thread::update::other'
  // 隐藏自己的跟贴内容
  | 'thread::hidden::self'
  // 隐藏他人的跟贴内容
  | 'thread::hidden::other'
  // 列出跟帖内容
  | 'thread::list'
  // 列出隐藏的thread
  | 'thread::list::hidden'
  // 获取公开个人信息
  | 'profile::get'
  // 修改自己的个人信息
  | 'profile::update::self'
  // 修改他人的个人信息
  | 'profile::update::other'
  // 创建一个回复
  | 'reply::create'
  // 展开回复
  | 'reply::query'
  // 创建一个角色
  | 'role::create'
  // 删除一个角色
  | 'role::remove'
  // 更新一个角色
  | 'role::update'
  // 获取角色
  | 'role::query'
  // 获取角色详细信息
  | 'role::info::get'
  // 创建一个权限
  | 'permission::create'
  // 删除一个权限
  | 'permission::remove'
  // 修改一个权限
  | 'permission::update'
  // 查询权限列表
  | 'permission::query'
  // 获取权限详细信息
  | 'permission::get'
  ;

declare type Operator = 'and' | 'or' | 'not' | 'AND' | 'OR' | 'NOT' | 'And' | 'Or' | 'Not' | '&' | '|' | '!';
declare type PermissionOption = {
  lhs: PermissionOption | PermissionTable;
  op: Operator;
  rhs: PermissionOption | PermissionTable;
};
// export {};
// declare module 'h3' {

// }

declare interface MininalProfile {
  role: {
    name: string;
    permission: import('prisma/prisma-client').Permission[];
  }[];
  name: string;
  bio: string;
  account_id: number;
}

declare interface AreaTable {
  name: string;
  manager: string;
  manager_id: number;
  id: number;
}

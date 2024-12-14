import { decode } from '@tsndr/cloudflare-worker-jwt';
import type { EventHandlerRequest, EventHandler } from 'h3';
import status from 'http-status';
import { accessTokenNs } from '../ns';
import { PERMISSION_NS } from './redis';
import type { Unit } from './permission-tree';
import prisma from '~/lib/prisma';

export function defineProtectedApi<T extends EventHandlerRequest, D>(
  handler: EventHandler<T, D>, requiredPermissions?: PermissionTable[]): EventHandler<T, Promise<D>>;
export function defineProtectedApi<T extends EventHandlerRequest, D>(
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  handler: EventHandler<T, D>, requiredPermissions?: string[]): EventHandler<T, Promise<D>>;
export function defineProtectedApi<T extends EventHandlerRequest, D>(
  handler: EventHandler<T, D>,
  requiredPermissions?: string[],
): EventHandler<T, Promise<D>> {
  return defineEventHandler<T>(
    async (event) => {
      const session = await getUserSession(event);
      const redis = useRedis();
      if (!session.user?.access_token || !session.user?.refresh_token) {
        throw createError({
          status: status.UNAUTHORIZED,
          statusMessage: status['401'],
        });
      }

      const { payload } = decode<JwtPayload>(session.user.access_token);
      if (!payload || payload.id == undefined) {
        throw createError({
          status: status.UNAUTHORIZED,
          statusMessage: status['401'],
        });
      }
      const { id } = payload;
      if (!redis.hasItem(accessTokenNs(id))) {
        throw createError({
          status: status.UNAUTHORIZED,
          statusMessage: status['401'],
        });
      }

      const cachePermissions = await redis.get<string[]>(PERMISSION_NS) ?? [];
      requiredPermissions?.forEach((p) => {
        if (!cachePermissions?.includes(p)) {
          cachePermissions.push(p);
        }
      });
      await redis.set(PERMISSION_NS, cachePermissions);
      const account = await prisma.account.findFirst({
        where: {
          id,
        },
        select: {
          profile: {
            select: {
              role: {
                select: {
                  permission: true,
                },
              },
            },
          },
        },
      });
      if (!account || !account.profile?.role) {
        throw createError({
          status: status.BAD_REQUEST,
          statusMessage: status['400'],
        });
      }
      const { profile: { role } } = account;
      if (!role) {
        throw createError({
          status: status.UNAUTHORIZED,
          statusMessage: status['401'],
        });
      }
      const permissions = role.flatMap(role => role.permission).map(p => p.name);
      if (
        requiredPermissions?.length
        && !permissions.some(permission => permission === '*')
        && permissions.every(permission => !requiredPermissions?.includes(permission))
      ) {
        throw createError({
          status: status.FORBIDDEN,
          statusMessage: status['403'],
        });
      }
      event.context = {
        ...event.context,
        user: {
          id,
          permissions,
        },
      };
      try {
        const response = await handler(event);
        return response;
      } catch (err) {
        console.log(err);
        // setResponseStatus(err.statsu)
        const error: any = err;
        setResponseStatus(event, error.statusCode ?? 500, error.statusMessage);
        return { ...error.cause };
      }
    },
  );
};

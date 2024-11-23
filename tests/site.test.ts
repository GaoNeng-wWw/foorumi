import { rmSync, existsSync } from 'fs';
import { join } from 'path';
import { test, expect, describe, beforeAll, vi } from 'vitest';
import { $fetch, setup } from '@nuxt/test-utils/e2e';

describe('site & setup', async () => {
  beforeAll(async () => {
    await setup({
      host: 'http://localhost:3000',
    });
    if (existsSync(join(__dirname, '../.tmp'))) {
      rmSync(
        join(__dirname, '../.tmp'),
        { recursive: true },
      );
    }
    await $fetch('/api/setup', { method: 'post', body: {
      siteName: 'test-site',
      adminEmail: 'admin@no-reply.com',
      adminPassword: 'admin',
      adminUserName: 'admin123',
    } });
  });
  test('GET SETUP INFO', async () => {
    const resp = await $fetch('/api/site', { method: 'get' });
    expect(resp).toBeDefined();
  });
  test('setup agin should recive error', async () => {
    const onErr = vi.fn();
    $fetch('/api/setup', { method: 'post', body: {
      siteName: 'test-site',
      adminEmail: 'admin@no-reply.com',
      adminPassword: 'admin',
      adminUserName: 'admin123',
    } })
      .catch(onErr)
      .finally(() => {
        expect(onErr).toBeCalled();
      });
  });
});

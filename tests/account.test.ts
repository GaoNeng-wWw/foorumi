import { setup, $fetch } from '@nuxt/test-utils';
import { beforeAll, describe, expect, test, vi } from 'vitest';

describe('Account', () => {
  beforeAll(async () => {
    await setup({
      host: 'http://localhost:3000',
    });
    $fetch(
      '/api/account',
      {
        method: 'put',
        body: {
          email: 'test1@no-reply.com',
          password: '123',
          name: 'test',
          bio: 'this is test account',
        },
      },
    )
      .then((resp) => {
        expect(resp).not.toBeNull();
      });
  });
  test('Register success because account not exists', async () => {
    $fetch(
      '/api/account',
      {
        method: 'put',
        body: {
          email: 'test2@no-reply.com',
          password: '123',
          name: 'test',
          bio: 'this is test account',
        },
      },
    )
      .then((resp) => {
        expect(resp).not.toBeNull();
      });
  });
  test('Register fail because account is exists', async () => {
    const errFn = vi.fn();
    $fetch(
      '/api/account',
      {
        method: 'put',
        body: {
          email: 'test1@no-reply.com',
          password: '123',
          name: 'test',
          bio: 'this is test account',
        },
      },
    )
      .catch((err) => {
        console.log(err);
        errFn();
      })
      .finally(() => {
        expect(errFn).toBeCalled();
      });
  });
  test('Login success because account is exists', async () => {
    $fetch(
      '/api/account',
      {
        method: 'post',
        body: {
          email: 'test1@no-reply.com',
          password: '123',
        },
      },
    )
      .then(resp => expect(resp).toBeUndefined);
  });
  test('Login fail because account password invalid', async () => {
    $fetch(
      '/api/account',
      {
        method: 'post',
        body: {
          email: 'test1@no-reply.com',
          password: '123456',
        },
      },
    )
      .catch((err) => {
        expect(err.messages).toBeDefined();
      });
  });
  test('Login fail because account not exists', async () => {
    $fetch(
      '/api/account',
      {
        method: 'post',
        body: {
          email: 'test3@no-reply.com',
          password: '123',
        },
      },
    )
      .catch((err) => {
        expect(err.messages).toBeDefined();
      });
  });
  test('Login success because account exists and password is valid', async () => {
    const successFn = vi.fn();
    $fetch(
      '/api/account',
      {
        method: 'post',
        body: {
          email: 'test1@no-reply.com',
          password: '123',
        },
      },
    )
      .then(successFn)
      .finally(() => {
        expect(successFn).toBeCalled();
      });
  });
});

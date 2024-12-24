import { join } from 'node:path';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@prisma/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint',
    '@nuxtjs/color-mode',
    // '@nuxt/test-utils/module',
    '@nuxtjs/i18n',
    'nuxt-auth-utils',
    '@vueuse/nuxt',
    'radix-vue/nuxt',
  ],
  plugins: [
    '~/plugins/permission',
  ],
  devtools: { enabled: import.meta.dev },
  colorMode: {
    classSuffix: '',
  },
  runtimeConfig: {
    sitePublic: true,
    authSecret: '123',
    pagination: {
      size: 10,
    },
    token: {
      access_token: {
        expiresIn: '1d',
      },
      refresh_token: {
        expiresIn: '1d',
      },
    },
    storage: {
      avatar: join(process.cwd(), './storage/avatar'),
      image: join(process.cwd(), './storage/image'),
      file: join(process.cwd(), './storage/file'),
    },
  },
  sourcemap: {
    client: true,
    server: true,
  },
  compatibilityDate: '2024-04-03',
  nitro: {
    storage: {
      redis: {
        driver: 'redis',
        port: 6379,
        host: '127.0.0.1',
        username: 'root',
        password: 'root',
        db: 0,
        tls: {},
      },
    },
    devStorage: {
      redis: {
        driver: 'fs',
        base: './.tmp',
      },
    },
  },
  eslint: {
    checker: true,
    config: {
      stylistic: {
        indent: 2,
        semi: true,
        braceStyle: '1tbs',
      },
    },
  },
  i18n: {
    vueI18n: './i18n/i18n.config.ts',
    experimental: {
      localeDetector: 'localeDetector.ts',
    },
    locales: ['zh', 'en'],
    defaultLocale: 'en',
  },
  prisma: {
    installStudio: false,
    generateClient: true,
  },
  tailwindcss: {
    config: {
      content: [
        './pages/**/*.vue',
        './components/**/*.vue',
        './node_modules/@miraiui-org/**/*.{js,ts,tsx,vue,md}',
        './contens/**/*.vue',
      ],
    },
  },
});

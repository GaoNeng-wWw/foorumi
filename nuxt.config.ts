// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: [
    '@prisma/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint',
    '@nuxtjs/color-mode',
    '@nuxt/test-utils/module',
    '@nuxtjs/i18n',
  ],
  devtools: { enabled: true },
  colorMode: {
    classSuffix: '',
  },
  runtimeConfig: {
    sitePublic: false,
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
    locales: ['zhCN', 'enUS'],
    defaultLocale: 'enUS',
  },
  prisma: {
    installStudio: false,
  },
  tailwindcss: {
    config: {
      content: ['./pages/**/*.vue',
        './components/**/*.vue',
        './node_modules/@miraiui-org/**/*.{js,ts,tsx,vue,md}',
        './contens/**/*.vue'],
    },
  },
});

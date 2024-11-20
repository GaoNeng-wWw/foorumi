import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  rules: {
    'curly': 'off',
    '@stylistic/brace-style': ['warn', '1tbs'],
  },
});

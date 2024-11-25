import en from './enUS';
import zh from './zhCN';

export default defineI18nConfig(() => {
  return {
    legacy: false,
    locale: 'zh',
    messages: {
      zh,
      en,
    },
  };
});

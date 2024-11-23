import enUS from './enUS';
import zhCN from './zhCN';

export default defineI18nConfig(() => {
  return {
    legacy: false,
    locale: 'zhCN',
    messages: {
      zhCN,
      enUS,
    },
  };
});

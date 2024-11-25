import { miraiUiPlugin } from '@miraiui-org/theme';

/** @type {import('tailwindcss').Config} */
export default {
  plugins: [
    miraiUiPlugin(),
    require('tailwindcss-animated'),
  ],
  theme: {
    extend: {
      fontSize: {
        tiny: '12px',
      },
    },
  },
};

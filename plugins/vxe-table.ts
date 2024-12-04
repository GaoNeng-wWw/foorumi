import VXETable from 'vxe-table';
import 'vxe-table/lib/style.css';

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.client) {
    nuxtApp.vueApp.use(VXETable);
  }
});

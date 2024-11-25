import { parseSetCookie, parse, serialize } from 'cookie-es';

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.meta.auth) {
    return;
  }
  const nuxtApp = useNuxtApp();
  if (import.meta.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered) {
    return;
  }
  const { loggedIn, fecth: fetchSession, clear: clearSession } = useUserSession();
  if (!loggedIn.value) {
    clearSession();
    return navigateTo('/auth/login');
  }
  const runtimeConfig = useRuntimeConfig();
  const serverEvent = useRequestEvent();
  try {
    await $fetch(
      '/api/auth/refresh',
      {
        method: 'post',
        onResponse({ response: { headers } }) {
          if (import.meta.server && serverEvent) {
            for (const setCookie of headers.getSetCookie()) {
              appendResponseHeader(serverEvent, 'Set-Cookie', setCookie);
              const { name, value } = parseSetCookie(setCookie);
              if (name === runtimeConfig.session.name) {
                const cookies = parse(serverEvent.headers.get('cookie') || '');
                cookies[name] = value;
                serverEvent.headers.set('cookie', Object.entries(cookies).map(([name, value]) => serialize(name, value)).join('; '));
                if (serverEvent.node?.req?.headers) {
                  serverEvent.node.req.headers['cookie'] = serverEvent.headers.get('cookie') || '';
                }
              }
            }
          }
        },
        onResponseError() {
          clearSession();
          navigateTo('/auth/login');
          return;
        },
      },
    );
    await fetchSession();
  } catch {
    //
  }
});

declare module 'h3' {
  interface H3EventContext {
    user: {
      id: number;
    };
  }
}

declare module '#auth-utils' {
  interface User {
    access_token: string;
    refresh_token: string;
  }

  interface UserSession {
    user: User;
  }
}

declare module 'vue-virtual-scroll-list' {}

export default {};

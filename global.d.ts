declare interface ApiCommonError {
  statusCode: number;
  stack: unknown[];
  data: {
    status: number;
    error: string;
  };
}

declare interface SiteMeta {
  siteName: string;
  siteLogo: never; // not implment
  isPublic: boolean;
}

declare type UnRef<T> = T extends Ref<infer P> ? P : unknown;

declare interface Area {
  id: number;
  name: string;
  manager_id: number;
  parent: number | null;
  manager: {
    name: string;
  };
}

declare interface JwtPayload {
  id: number;
}

declare namespace NodeJS {
  interface ProcessEnv {
    NUXT_TOKEN_PASSWORD: string;
    NUXT_TOKEN_ACCESS_TOKEN_EXPIRES: string;
    NUXT_TOKEN_REFRESH_TOKEN_EXPIRES: string;
    NUXT_SESSION_PASSWORD: string;
  }
}

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

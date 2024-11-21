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

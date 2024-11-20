declare interface ApiCommonError {
  statusCode: number;
  stack: unknown[];
  data: {
    status: number;
    error: string;
  };
}

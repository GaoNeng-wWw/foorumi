export interface ErrOpts<T> {
  msg?: string;
  data?: T;
  statusCode?: number;
}
export const createErr = <T extends object>(
  message = 'Internal Server Error', statusCode = 500, data?: T, cause?: boolean,
) => {
  return createError({
    statusCode,
    data: {
      status: statusCode,
      error: message,
      ...(data ?? {}),
    },
    cause,
  });
};

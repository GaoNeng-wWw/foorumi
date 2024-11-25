export const ns = (...ns: string[]) => {
  return ns.join('::');
};

export const accessTokenNs = (id: string | number) => ns('token', 'access_token', id.toString());
export const refreshTokenNs = (id: string | number) => ns('token', 'refresh_token', id.toString());

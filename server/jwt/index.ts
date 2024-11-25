import jwt from '@tsndr/cloudflare-worker-jwt';

export const verifyToken = (token: string, password: string) => {
  return jwt.verify(token, password);
};

export const createToken = (payload: JwtPayload, type: 'access_token' | 'refresh_token', password: string, exp: number) => {
  return jwt.sign({
    exp: Math.floor(Date.now() / 1000) + exp,
    ...payload,
    type,
  }, password);
};

import { pbkdf2Sync, randomBytes } from 'node:crypto';

export const bcrypt = (val: string, salt: string) => pbkdf2Sync(val, salt, 100, 16, 'sha256').toString('hex');
export const randomSalt = (len: number) => randomBytes(len).toString('base64');

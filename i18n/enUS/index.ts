import auth from './auth';
import httpStatus from './httpStatus';

export default {
  ...auth,
  ...httpStatus,
} as const;

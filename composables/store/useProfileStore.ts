import { PROFILE } from '~/lib/constant';

export const useProfile = () => useState<MininalProfile | null>(PROFILE, () => null);

import { PERMISSIONS } from '~/lib/constant';

export const usePermissionStore = () => useState<string[] | null>(PERMISSIONS, () => null);

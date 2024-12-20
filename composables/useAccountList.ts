import { useMessage } from '@miraiui-org/vue-message';
import type { SerializeObject, Simplify } from 'nitropack/types';

export type AdminAccountData = SerializeObject<{
  profile: {
    role: {
      id: number;
      name: string;
      desc: string;
    }[];
    name: string;
    bio: string;
  } | null;
  id: number;
  ban: boolean;
  reason: string | null;
  ban_expire: Date | null;
}>;

export type PatchData = {
  id: number;
  profile: {
    name: string;
    bio: string;
  };
  ban?: boolean;
  reason?: string;
  ban_expire?: string;
  roleIds?: number[];
};

export const useAccountList = ({ initializationPage }: { initializationPage?: Ref<number> | number }) => {
  const page = ref(unref(initializationPage) ?? 1);
  const { data, error, status } = useFetch('/api/account/list', { method: 'get', query: { page }, cache: 'default', watch: [page], server: false });
  const isFinish = computed(() => data.value?.end);
  const accountList: Ref<AdminAccountData[]> = ref(data.value ? data.value.data : []);
  const totalItems = computed<number>(() => data.value?.total ?? 0);
  const showAccountInfo = ref(false);
  const accountInfo: Ref<
    Simplify<AdminAccountData | null>
  > = ref(null);
  const next = () => {
    if (isFinish.value) {
      return;
    }
    page.value += 1;
  };
  const to = (to: number) => {
    page.value = to;
  };
  const prev = () => {
    if (page.value === 0) {
      return;
    }
    page.value -= 1;
  };
  const info = (id: number) => {
    $fetch(
      `/api/account/${id}`,
      {
        method: 'get',
      },
    )
      .then((account) => {
        if (!account) {
          return;
        }
        accountInfo.value = account;
        showAccountInfo.value = true;
        console.log(showAccountInfo.value);
      });
  };
  const patch = (
    { row }: { row: PatchData },
  ) => {
    return $fetch(
      `/api/account/${row.id}`,
      {
        method: 'patch',
        body: {
          ...row,
        },
      },
    )
      .then((newAccount: AdminAccountData) => {
        const oldAccountIdx = accountList.value.findIndex(account => account.id === newAccount.id);
        accountList.value.splice(oldAccountIdx, 1, newAccount);
      })
      .catch((err) => {
        useMessage({
          type: 'danger',
          content: err.data.message,
        });
      });
  };
  watch(data, () => {
    accountList.value = data.value ? data.value.data : [];
  }, { immediate: true, deep: true });
  return { accountList, error, status, isFinish, next, prev, patch, info, to, showAccountInfo, accountInfo, totalItems, page };
};

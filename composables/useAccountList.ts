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

type UseAccountList = {
  name?: Ref<string>;
  initializationPage?: Ref<number> | number;
};

export const useAccountList = ({ initializationPage, name: _name }: UseAccountList) => {
  const page = ref(unref(initializationPage) ?? 1);
  const name = ref(_name?.value ? _name.value : undefined);
  const { data, error, status } = useFetch(
    '/api/account/list',
    {
      method: 'get',
      query: { page, name },
      cache: 'default',
      watch: [page, name],
      server: false,
    },
  );
  const isFinish = computed(() => data.value?.end);
  const accountList: Ref<AdminAccountData[]> = ref(data.value ? data.value.data : []);
  const totalItems = computed<number>(() => data.value?.total ?? 0);
  const size = computed<number>(() => data.value?.size ?? 20);
  const loading = computed(() => status.value === 'pending');
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
  watchDebounced(() => _name, () => {
    name.value = _name?.value;
  }, { debounce: 250, deep: true });
  return { accountList, error, status, isFinish, showAccountInfo, accountInfo, totalItems, page, size, loading, next, prev, patch, info, to };
};

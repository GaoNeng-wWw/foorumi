import type { Reactive } from 'vue';
import type { Role, Permission } from '@prisma/client';
import type { SerializeObject } from 'nitropack/types';
import type { VxeTableInstance } from 'vxe-table';
import { useMessage } from '@miraiui-org/vue-message';
import type { AppTagSelectOption } from '~/components/AppTagSelect/index.type';

export type RoleData = {
  name: string;
  desc: string;
  permissions: number[];
};
export const useRole = () => {
  const role: Reactive<RoleData> = reactive({
    name: '',
    desc: '',
    permissions: [],
  });
  const page = ref(1);
  const activeId = ref(-1);
  const { data: permissionData } = useFetch('/api/permission', { method: 'get', query: { all: true }, server: false });
  const { data: payload } = useFetch<PaginatedData<SerializeObject<Role>> | null>('/api/role', { method: 'get', server: false, query: { page } });
  const { data: allRole } = useFetch<SerializeObject<Role>[]>('/api/role/', { method: 'get', query: { all: true }, server: false, lazy: true });
  const permissions = computed<SerializeObject<Permission>[]>(() => permissionData.value?.data ?? []);
  const permissionsInput: ComputedRef<AppTagSelectOption<number>[]> = computed(() => {
    return permissions.value.map<AppTagSelectOption<number>>((p) => {
      return {
        value: p.id,
        label: p.name,
      };
    });
  });
  const table = useTemplateRef<VxeTableInstance>('table');
  const totalItems = computed(() => payload.value?.total ?? 0);
  const size = computed(() => payload.value?.size ?? 20);
  const { isOpen: isDialogOpen, open: openDialog, close: hiddenDialog } = useDialog({});
  const data = ref<SerializeObject<Role>[]>([]);

  const restoreRole = () => {
    role.name = '';
    role.desc = '';
    role.permissions = [];
  };

  const removeUser = (id: number) => {
    $fetch(`/api/role/${id}`, { method: 'delete' })
      .then(() => {
        data.value = data.value.filter(role => role.id !== id);
      })
      .catch((err) => {
        useMessage({
          content: err.data.message,
          type: 'danger',
        });
      });
  };

  const closeDialog = () => {
    restoreRole();
    hiddenDialog();
  };

  const detailPatch = () => {
    $fetch(
      `/api/role/${activeId.value}`,
      {
        method: 'patch',
        body: {
          name: role.name,
          desc: role.desc,
          permissionIds: role.permissions,
        },
      },
    )
      .then((role) => {
        const idx = data.value.findIndex(oldRole => oldRole.id === role.id);
        if (idx === -1) {
          data.value.unshift(role);
          return;
        }
        data.value.splice(idx, 1, {
          name: role.name,
          desc: role.desc,
          update_at: role.update_at,
          create_at: role.create_at,
          id: role.id,
        });
        table.value?.reloadData(data.value);
      })
      .finally(() => {
        closeDialog();
      });
  };

  const patchRole = ({ row }: { row: Role }) => {
    $fetch(
      `/api/role/${row.id}`,
      {
        method: 'patch',
        body: {
          name: row.name,
          desc: row.desc,
        },
      },
    )
      .then((role) => {
        const oldRoleId = data.value.findIndex(data => data.id === role.id);
        data.value.splice(oldRoleId, 1, {
          name: role.name,
          desc: role.desc,
          update_at: role.update_at,
          create_at: role.create_at,
          id: role.id,
        });
        useMessage({
          content: '修改成功',
        });
      })
      .catch((err) => {
        useMessage({
          type: 'danger',
          content: err.data.message,
        });
      });
  };

  const addRole = () => {
    $fetch(
      '/api/role',
      {
        method: 'post',
        body: {
          name: role.name,
          desc: role.desc,
          permissionIds: role.permissions,
        },
      },
    )
      .then((value) => {
        data.value.unshift(value);
        useMessage({
          type: 'success',
          content: `添加角色${value.name}成功`,
        });
        role.permissions = [];
        role.name = '';
        role.desc = '';
      })
      .catch((err) => {
        useMessage({
          type: 'success',
          content: err.data.message,
        });
      });
  };

  const getRoleInfo = (id: number) => {
    $fetch(`/api/role/${id}`, { method: 'get' })
      .then((roleInfo) => {
        if (!roleInfo) {
          close();
          return;
        }
        role.name = roleInfo.name;
        role.desc = roleInfo.desc;
        role.permissions = roleInfo.permission.map(v => v.id);
        activeId.value = roleInfo.id;
        openDialog();
      });
  };

  watch(payload, () => {
    if (!payload.value) {
      data.value = [];
      return;
    }
    data.value = payload.value.data;
  }, { immediate: true, deep: true });

  return {
    permissionsInput, table, totalItems, role, data, page, size, allRole,
    restoreRole, removeUser, closeDialog, detailPatch, patchRole, addRole, getRoleInfo, isDialogOpen, openDialog,
  };
};

<script lang="ts" setup>
import { Button as MButton } from '@miraiui-org/vue-button';
import { useMessage } from '@miraiui-org/vue-message';
import type { Role, Permission } from '@prisma/client';
import type { SerializeObject } from 'nitropack/types';
import type { VxeTableInstance } from 'vxe-table';
import type { AppTagSelectOption } from '~/components/AppTagSelect/index.type';

const role = reactive({
  name: '',
  desc: '',
});
const activeId = ref(-1);

const page = ref(1);

const { data: permissionData } = useFetch('/api/permission', { method: 'get', query: { all: true }, server: false });
const { data: payload } = useFetch<PaginatedData<SerializeObject<Role>> | null>('/api/role', { method: 'get', server: false, query: { page } });
const data = ref<SerializeObject<Role>[]>([]);

const addedPermission = ref<number[]>([]);
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
const showDialog = ref(false);
const totalItems = computed(() => payload.value?.total ?? 0);

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
  addedPermission.value = [];
  role.name = '';
  role.desc = '';
  showDialog.value = false;
};

const detailPatch = () => {
  $fetch(
    `/api/role/${activeId.value}`,
    {
      method: 'patch',
      body: {
        name: role.name,
        desc: role.desc,
        permissionIds: addedPermission.value,
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
        permissionIds: addedPermission.value,
      },
    },
  )
    .then((value) => {
      data.value.unshift(value);
      useMessage({
        type: 'success',
        content: `添加角色${value.name}成功`,
      });
      addedPermission.value = [];
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
        showDialog.value = false;
        return;
      }
      role.name = roleInfo.name;
      role.desc = roleInfo.desc;
      addedPermission.value = roleInfo.permission.map(v => v.id);
      activeId.value = roleInfo.id;
      showDialog.value = true;
    });
};

watch(payload, () => {
  if (!payload.value) {
    data.value = [];
    return;
  }
  data.value = payload.value.data;
}, { immediate: true, deep: true });
</script>

<template>
  <div class="w-full h-full bg-default-100 rounded-md p-4 space-y-2 flex flex-col">
    <div class="flex-shrink-0 flex-grow-0 h-fit">
      <app-popover :side-offset="8">
        <template #trigger>
          <m-button>
            新增角色
          </m-button>
        </template>
        <div class="p-2 max-w-sm bg-background shadow dark:bg-default-200 rounded-md space-y-2">
          <base-input
            v-model="role.name"
            :validator="() => Boolean(role.name.length)"
            error-message="角色名不能为空"
            trigger="blur"
            label="角色名"
            label-position="top"
            show-label
            input-wrapper-class="group-data[error='true']:bg-danger/50 group-data[error='false']:!bg-default-200 group-data[error='false']:dark:!bg-default-300"
          />

          <base-input
            v-model="role.desc"
            :validator="() => Boolean(role.desc.length)"
            error-message="角色介绍不能为空"
            trigger="blur"
            label="介绍"
            label-position="top"
            show-label
            input-wrapper-class="group-data[error='true']:bg-danger/50 group-data[error='false']:!bg-default-200 group-data[error='false']:dark:!bg-default-300"
          />

          <div class="space-y-1">
            <label>
              权限选择
            </label>
            <app-tag-select
              v-model="addedPermission"
              :options="permissionsInput"
              :max-height="128"
              multiple
            />
          </div>

          <m-button
            class="w-full"
            type="primary"
            @click="addRole"
          >
            提交
          </m-button>
        </div>
      </app-popover>
    </div>
    <div class="flex-auto overflow-auto">
      <client-only>
        <vxe-table
          ref="table"
          keep-source
          :data="data"
          border
          :edit-config="{
            trigger: 'click',
            mode: 'cell',
          }"
          @edit-closed="patchRole"
        >
          <vxe-column
            title="id"
            field="id"
          />
          <vxe-column
            title="角色名"
            field="name"
            :edit-render="{ name: 'input' }"
          />
          <vxe-column
            title="介绍"
            field="desc"
            :edit-render="{ name: 'input' }"
          />
          <vxe-column
            field="action"
            title="操作列"
            width="240"
          >
            <template #default="{ row }">
              <div class="space-x-2">
                <m-button
                  type="danger"
                  @click="() => removeUser(row.id)"
                >
                  <!-- TOOD: I18 -->
                  删除
                </m-button>

                <m-button
                  @click="() => getRoleInfo(row.id)"
                >
                  <!-- TOOD: I18 -->
                  获取信息
                </m-button>
              </div>
            </template>
          </vxe-column>
        </vxe-table>
      </client-only>
    </div>
    <div class="flex-shrink-0 flex-grow-0 h-fit">
      <pagination
        :total-item="totalItems"
        :page-size="20"
        @page-update="(cur) => page=cur"
      />
    </div>
    <dialog-root v-model:open="showDialog">
      <dialog-portal>
        <dialog-overlay class="fixed top-0 left-0 w-full h-full z-30 bg-black/30">
          <dialog-content class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[80vh] max-h-[95vh] w-full p-4 bg-default-200 rounded">
            <dialog-title class="text-2xl mb-4">
              <!-- TODO: I18N -->
              修改角色
            </dialog-title>
            <dialog-description>
              <base-input
                v-model="role.name"
                :validator="() => Boolean(role.name.length)"
                error-message="角色名不能为空"
                trigger="blur"
                label="角色名"
                label-position="top"
                show-label
                input-wrapper-class="group-data[error='true']:bg-danger/50 group-data[error='false']:!bg-default-200 group-data[error='false']:dark:!bg-default-300"
              />
              <base-input
                v-model="role.desc"
                :validator="() => Boolean(role.desc.length)"
                error-message="角色介绍不能为空"
                trigger="blur"
                label="介绍"
                label-position="top"
                show-label
                input-wrapper-class="group-data[error='true']:bg-danger/50 group-data[error='false']:!bg-default-200 group-data[error='false']:dark:!bg-default-300"
              />

              <div class="space-y-1 mt-2">
                <label>
                  权限选择
                </label>
                <app-tag-select
                  v-model="addedPermission"
                  :options="permissionsInput"
                  :max-height="128"
                  multiple
                />
              </div>
            </dialog-description>
            <div class="w-fit mt-4 ml-auto mr-0">
              <dialog-close
                as-child
              >
                <m-button
                  type="primary"
                  @click="detailPatch"
                >
                  保存修改
                </m-button>
                <m-button
                  type="default"
                  class="ml-2"
                  @click="closeDialog"
                >
                  取消
                </m-button>
              </dialog-close>
            </div>
          </dialog-content>
        </dialog-overlay>
      </dialog-portal>
    </dialog-root>
  </div>
</template>

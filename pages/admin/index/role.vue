<script lang="ts" setup>
import { Button as MButton } from '@miraiui-org/vue-button';
import { useMessage } from '@miraiui-org/vue-message';
import type { Role, Permission } from '@prisma/client';
import type { SerializeObject } from 'nitropack/types';
import type { InputSelectOptions } from '~/components/AppInputSelect/index.props';
import type { OptionProps } from '~/components/AppInputSelect/option.props';

const role = reactive({
  name: '',
  desc: '',
});

const { data: permissionData } = useFetch('/api/permission', { method: 'get', query: { all: true }, server: false });
const { data: payload } = useFetch<PaginatedData<SerializeObject<Role>> | null>('/api/role', { method: 'get', server: false });
const data = ref<SerializeObject<Role>[]>([]);

const addedPermission = ref<OptionProps[]>([
  { label: '*', value: 1 },
]);
const permissions = computed<SerializeObject<Permission>[]>(() => permissionData.value?.data ?? []);
const permissionsInput = computed<InputSelectOptions>(() => {
  return permissions.value.map((p) => {
    return {
      value: p.id,
      label: p.name,
    };
  });
});

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

watch(payload, () => {
  if (!payload.value) {
    data.value = [];
    return;
  }
  data.value = payload.value.data;
}, { immediate: true, deep: true });
</script>

<template>
  <div class="w-full h-full bg-default-100 rounded-md p-4 space-y-2">
    <app-popover :side-offset="8">
      <template #trigger>
        <m-button>
          新增角色
        </m-button>
      </template>
      <div class="p-2 max-w-sm bg-background shadow dark:bg-default-200 rounded-md space-y-2">
        <base-input
          v-model="role.name"
          label="角色名"
          label-position="top"
          show-label
          input-wrapper-class="group-data[error='true']:bg-danger/50 group-data[error='false']:!bg-default-200 group-data[error='false']:dark:!bg-default-300"
        />

        <base-input
          v-model="role.name"
          label="介绍"
          label-position="top"
          show-label
          input-wrapper-class="group-data[error='true']:bg-danger/50 group-data[error='false']:!bg-default-200 group-data[error='false']:dark:!bg-default-300"
        />

        <div class="space-y-1">
          <label>
            权限选择
          </label>
          <app-input-select
            v-model="addedPermission"
            :options="permissionsInput"
            :max-height="128"
            multiple
            show-select-all
          />
        </div>

        <m-button
          class="w-full"
          type="primary"
        >
          提交
        </m-button>
      </div>
    </app-popover>
    <client-only>
      <vxe-table
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
        >
          <template #default="{ row }">
            <m-button
              type="danger"
              @click="() => removeUser(row.id)"
            >
              <!-- TOOD: I18 -->
              删除
            </m-button>
          </template>
        </vxe-column>
      </vxe-table>
    </client-only>
  </div>
</template>

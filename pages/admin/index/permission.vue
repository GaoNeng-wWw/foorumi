<script lang="ts" setup>
import { useMessage } from '@miraiui-org/vue-message';
import { Button as MButton } from '@miraiui-org/vue-button';
import type { Permission } from '@prisma/client';
import type { SerializeObject } from 'nitropack/types';

definePageMeta({
  auth: true,
});

const permission = reactive({
  name: '',
  desc: '',
});
const popoverVisible = ref(false);
const page = ref(1);
const totalItems = ref(0);
const { data } = useFetch('/api/permission', { method: 'get', query: { page }, server: false, watch: [page], cache: 'default' });
const permissionTable: Ref<SerializeObject<Permission>[]> = ref([]);
watch(data, () => {
  if (!data.value) {
    return;
  }
  permissionTable.value = data.value.data;
  totalItems.value = data.value.total;
}, { immediate: true, deep: true });

const patchPermission = ({ row }: { row: Permission }) => {
  $fetch(
    `/api/permission/${row.id}`,
    {
      method: 'patch',
      body: {
        name: row.name,
        desc: row.desc,
      },
    },
  )
    .then((row) => {
      useMessage({
        type: 'info',
        content: '修改成功', // TODO: I18N
      });
      const oldIdx = permissionTable.value.findIndex(p => p.id === row.id);
      permissionTable.value.splice(oldIdx, 1, row);
    })
    .catch((reason) => {
      useMessage({
        type: 'danger',
        content: reason.data.message,
      });
      const oldIdx = permissionTable.value.findIndex(p => p.id === row.id);
      permissionTable.value.splice(oldIdx, 1, permissionTable.value[oldIdx]);
    });
};
const addPermission = () => {
  if (!permission.name || !permission.desc) {
    return;
  }
  $fetch('/api/permission', {
    method: 'post',
    body: {
      ...permission,
    },
  })
    .then((permission) => {
      permissionTable.value.unshift(permission);
      useMessage({
        content: '添加成功', // I18N
      });
    })
    .catch((err) => {
      useMessage({
        type: 'danger',
        content: err.data.message,
      });
    })
    .finally(() => {
      permission.name = '';
      permission.desc = '';
    });
};
const removePermission = ({ row }: { row: Permission }) => {
  console.log(row);
  $fetch(
    `/api/permission/${row.id}`,
    {
      method: 'delete',
    },
  )
    .then(() => {
      useMessage({
        content: '删除成功', // I18N
      });
      totalItems.value -= 1;
      permissionTable.value = permissionTable.value.filter(p => p.id !== row.id);
    })
    .catch((err) => {
      useMessage({
        type: 'danger',
        content: err.data.message,
      });
    });
};
</script>

<template>
  <div class="w-full h-full p-4 bg-default-100 rounded space-y-4 flex flex-col">
    <div class="flex-shink-0 flex-grow-0 h-fit">
      <app-popover
        v-model:open="popoverVisible"
        :side-offset="8"
      >
        <template #trigger>
          <m-button>
            添加
          </m-button>
        </template>
        <div class="w-fit p-2 bg-default-200 rounded space-y-4">
          <div class="space-y-2">
            <base-input
              v-model="permission.name"
              label="权限key"
              label-position="top"
              show-label
              :trigger="'blur'"
              required
              :validator="() => Boolean(permission.name.length)"
              error-message="权限 Key 不能为空"
            />

            <base-input
              v-model="permission.desc"
              label="权限介绍"
              label-position="top"
              show-label
              trigger="blur"
              required
              :validator="() => Boolean(permission.desc.length)"
              error-message="权限介绍不能为空"
            />
          </div>

          <m-button
            class="w-full"
            type="primary"
            @click="addPermission"
          >
            提交
          </m-button>
        </div>
      </app-popover>
    </div>
    <div class="flex-auto overflow-auto">
      <client-only>
        <vxe-table
          border
          keep-source
          :edit-config="{
            trigger: 'click',
            mode: 'cell',
          }"
          :data="permissionTable"
          :max-height="'100%'"
          :row-config="{ keyField: 'id', isHover: true, drag: true, useKey: true }"
          @edit-closed="patchPermission"
        >
          <vxe-column
            field="name"
            title="权限名"
            :edit-render="{ name: 'input' }"
          />
          <vxe-column
            field="desc"
            title="权限简介"
            :edit-render="{ name: 'input' }"
          />
          <vxe-column>
            <template #default="{ row }">
              <m-button
                type="danger"
                @click="() => removePermission({ row })"
              >
                删除
              </m-button>
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
  </div>
</template>

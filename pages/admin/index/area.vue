<script lang="ts" setup>
import type { VxeTableInstance } from 'vxe-table';
import { useMessage } from '@miraiui-org/vue-message';
import UserSelect from './components/user-select.vue';

type AreaTable = {
  id: number;
  manager: {
    value: number;
    label: string;
  };
  name: string;
  parent: number | null;
};

const table = useTemplateRef<VxeTableInstance<Area>>('table');
const { flatTree: rawTreeData } = useAreaTree();
const tableData = ref<AreaTable[]>([]);
let counter = 0;
watch(rawTreeData, () => {
  tableData.value = rawTreeData.value.map((item) => {
    return {
      id: item.id,
      manager: {
        value: item.manager_id,
        label: item.manager.name,
      },
      name: item.name,
      parent: item.parent,
    };
  });
  counter = Math.max(...tableData.value.map(item => item.id)) + 1;
}, { immediate: true });
const addNode = async (parent: Area, mode: 'hierarchy' | 'leveling') => {
  if (!table.value) {
    return;
  }
  let parentId = parent.id;
  if (mode === 'leveling') {
    parentId = table.value.getRowById(parent.id).parent;
  }
  const data = {
    name: Date.now().toString(),
    manager: {
      name: '',
    },
    manager_id: -1,
    parent: parentId,
    id: counter++,
  } as Area;
  const { row } = await table.value.insertAt(data, mode === 'hierarchy' ? null : parent);
  await table.value.setTreeExpand(parent, true);
  await table.value?.setEditRow(row);
};
const editRow = async (row: Area) => {
  await table.value?.setEditRow(row);
};
const cancelEdit = async (row: AreaTable) => {
  if (table.value?.isInsertByRow(row)) {
    await table.value.remove(row);
  }
  await table.value?.clearEdit(row);
};
const save = (row: AreaTable) => {
  let invalidField = '';
  let i18nMessage = '';
  if (!row.manager || !row.manager.value) {
    invalidField = 'manager';
    i18nMessage = '管理员不能为空';
  } else if (!row.name) {
    invalidField = 'name';
    i18nMessage = '区域名不能为空';
  }
  if (invalidField) {
    useMessage({
      content: i18nMessage,
      type: 'danger',
    });
    return;
  }
  if (table.value?.isInsertByRow(row)) {
    $fetch('/api/area', {
      method: 'put',
      body: {
        name: row.name,
        manager_id: row.manager.value,
        parent: row.parent,
      },
    })
      .then((resp) => {
        const res = resp as Pick<Area, 'id' | 'name' | 'parent'>;
        row.id = res.id;
        row.name = res.name;
        row.parent = res.parent;
        table.value?.clearEdit(row);
      });
    return;
  }
  $fetch('/api/area', {
    method: 'patch',
    query: {
      id: row.id,
    },
    body: {
      name: row.name,
      parent: row.parent,
      manager_id: row.manager.value,
    },
  })
    .then(() => {
      // TODO: I18N
      useMessage({
        content: '修改成功',
      });
      return;
    })
    .catch((err) => {
      useMessage({
        content: err.data.message,
        type: 'danger',
      });
    });
  table.value?.clearEdit(row);
};
const removeRow = (row: AreaTable) => {
  $fetch('/api/area', {
    method: 'delete',
    query: {
      id: row.id,
    },
  })
    .then(() => {
      // TODO: 1I8
      useMessage({
        content: '删除成功',
        type: 'success',
      });
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        return;
      }
      useMessage({
        content: err.data.message,
        type: 'danger',
      });
    })
    .finally(() => {
      table.value?.remove(row);
    });
};
const isEdit = (row: Area) => table.value?.isEditByRow(row);
</script>

<template>
  <div class="w-full h-full bg-default-100 rounded-md">
    <div class="p-4 flex flex-col h-full gap-4">
      <client-only>
        <div class="w-full h-full">
          <vxe-table
            ref="table"
            keep-source
            border
            max-height="100%"
            :row-config="{ keyField: 'id', isHover: true, drag: true, useKey: true }"
            :edit-config="{ trigger: 'manual', mode: 'row', showStatus: true, autoClear: false }"
            :data="tableData"
            :tree-config="{
              transform: true,
              rowField: 'id',
              parentField: 'parent',
            }"
            :scroll-y="{ enabled: true, gt: 0 }"
            :column-config="{ resizable: true, useKey: true }"
          >
            <vxe-column
              field="id"
              name="id"
              tree-node
            />
            <vxe-column
              field="name"
              title="版区名称"
              :edit-render="{}"
            >
              <template #edit="{ row }">
                <base-input
                  v-model="row.name"
                  class="rounded-md"
                />
              </template>
            </vxe-column>
            <vxe-column
              field="manager"
              title="管理员"
              :edit-render="{}"
            >
              <template #default="{ row }">
                <nuxt-link>
                  {{ row.manager?.label }}
                </nuxt-link>
              </template>
              <template #edit="{ row }">
                <user-select
                  v-model="row.manager"
                  :default-id="row.manager?.value"
                />
              </template>
            </vxe-column>
            <vxe-column>
              <template #default="{ row }">
                <div class="w-full flex items-start gap-4 flex-wrap justify-center">
                  <div
                    v-if="isEdit(row)"
                    class="flex w-full items-center gap-4 "
                  >
                    <button
                      class="text-primary-500"
                      @click="() => save(row)"
                    >
                      保存
                    </button>
                    <button
                      @click="() => cancelEdit(row)"
                    >
                      取消编辑
                    </button>
                  </div>
                  <div
                    v-if="!isEdit(row)"
                    class="flex w-full gap-4 text-foreground [&_button:hover]:text-primary-500"
                  >
                    <button
                      @click="() => addNode(row, 'hierarchy')"
                    >
                      添加子节点
                    </button>
                    <button
                      @click="() => addNode(row, 'leveling')"
                    >
                      添加同级节点
                    </button>
                  </div>
                  <div
                    v-if="!isEdit(row)"
                    class="flex w-full gap-4"
                  >
                    <button
                      class="text-foreground"
                      @click="() => editRow(row)"
                    >
                      编辑
                    </button>
                    <button class="text-primary">
                      移动
                    </button>
                    <button
                      class="text-danger"
                      @click="() => removeRow(row)"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </template>
            </vxe-column>
          </vxe-table>
        </div>
      </client-only>
    </div>
  </div>
</template>

import { useMessage } from '@miraiui-org/vue-message';
import type { ShallowRef } from 'vue';
import type { VxeTableInstance } from 'vxe-table';

type AreaTable = {
  id: number;
  manager: {
    value: number;
    label: string;
  };
  name: string;
  parent: number | null;
};

type CreateAreaBody = {
  name: string;
  manager_id?: number;
  parent: number | null;
};

type UseAreaTableOptions = {
  table: Readonly<ShallowRef<VxeTableInstance<Area> | null>>;
};

export const useAreaTable = ({ table }: UseAreaTableOptions) => {
  const { flatTree: rawTreeData, treeSelectData, refresh } = useAreaTree();
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
  const putArea = (area: CreateAreaBody) => {
    $fetch('/api/area', {
      method: 'put',
      body: {
        ...area,
      },
    })
      .then((realArea) => {
        tableData.value.unshift(realArea);
      });
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
    console.log(row.manager.value);
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
          return table.value?.remove(row);
        })
        .then((resp) => {
          if (!resp) {
            return;
          }
          tableData.value.push({
            ...resp.row,
          });
          return refresh();
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
      .then(() => {
        table.value?.clearEdit(row);
        const rowDataIndex = tableData.value.findIndex(item => item.id === row.id);
        refresh()
          .then(() => {
            tableData.value.splice(rowDataIndex, 1, {
              ...row,
            });
          });
      })
      .catch((err) => {
        useMessage({
          content: err.data.message,
          type: 'danger',
        });
      });
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
      .then(() => {
        tableData.value = tableData.value.filter(item => item.id !== row.id);
        refresh();
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

  const move = (row: AreaTable & { _parent: number | null }, newParent: string | null) => {
    if (!table.value) {
      return;
    }
    if (newParent !== null && Number.parseInt(newParent) === row.id) {
      // TODO: I18N
      useMessage({
        content: `不能将区域${row.name}移动到${row.name}`,
        type: 'danger',
      });
      row._parent = row.parent;
      table.value.reloadRow(row);
      return;
    }
    $fetch('/api/area', {
      method: 'patch',
      query: {
        id: row.id,
      },
      body: {
        parent: newParent === null ? null : Number.parseInt(newParent),
        name: row.name,
        manager_id: row.manager.value,
      },
    })
      .then(() => {
        useMessage({
          content: '移动成功',
          type: 'success',
        });
        return refresh();
      })
      .then(() => {
        return table.value?.reloadData(tableData.value);
      })
      .catch((err) => {
        useMessage({
          content: err.data.message,
          type: 'danger',
        });
      });
  };

  const isEdit = (row: Area) => table.value?.isEditByRow(row);
  return { addNode, editRow, cancelEdit, save, removeRow, move, isEdit, putArea, treeSelectData, tableData };
};

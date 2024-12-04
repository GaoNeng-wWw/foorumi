<script lang="ts" setup>
import type { VxeTableInstance } from 'vxe-table';
import UserSelect from './components/user-select.vue';

const table = useTemplateRef<VxeTableInstance<Area>>('table');

const { addNode, editRow, cancelEdit, save, removeRow, move, isEdit, treeSelectData, tableData } = useAreaTable({ table });
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
              showLine: true,
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
                    <app-tree-select
                      v-model:value="row._parent"
                      :data="treeSelectData"
                      :side-offset="16"
                      :default-select-id="(row.parent === null || row.parent === undefined) ? [] : [row.parent.toString()]"
                      content-class="min-w-64"
                      destory
                      @update:value="(value) => move(row, value)"
                    >
                      <template #trigger>
                        <button class="text-primary">
                          移动
                        </button>
                      </template>
                    </app-tree-select>
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

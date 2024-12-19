<script lang="ts" setup>
import { Button as MButton } from '@miraiui-org/vue-button';

const { role, permissionsInput, addRole, removeUser, patchRole, detailPatch, getRoleInfo, data, totalItems, page, isDialogOpen, closeDialog } = useRole();
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
              v-model="role.permissions"
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
    <dialog-root
      v-model:open="isDialogOpen"
      @update:open="(isOpen) => !isOpen ? nextTick(() => closeDialog()) : null"
    >
      <dialog-portal>
        <dialog-overlay
          class="fixed top-0 left-0 w-full h-full z-30 bg-black/30"
        >
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
                  v-model="role.permissions"
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

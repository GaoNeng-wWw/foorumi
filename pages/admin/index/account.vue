<script lang="ts" setup>
import { Button as MButton } from '@miraiui-org/vue-button';
import type { VxeTableInstance } from 'vxe-table';
import AccountInfoModal from './components/account-info-modal.vue';

const table = useTemplateRef<VxeTableInstance>('table');
const { accountList, showAccountInfo, accountInfo, totalItems, patch, info, to } = useAccountList({});
const { isOpen, open, close } = useDialog({});
watch(accountInfo, () => {
  if (!accountInfo) {
    close();
    return;
  }
  open();
});

const onPatch = (accountData: AdminAccountData | null, roleIds: number[]) => {
  if (!accountData || !accountData.profile) {
    return;
  }
  patch({
    row: {
      id: accountData.id,
      ban: accountData.ban ?? undefined,
      ban_expire: !accountData.ban_expire ? undefined : accountData.ban_expire,
      profile: {
        name: accountData.profile.name,
        bio: accountData.profile.bio,
      },
      roleIds: roleIds,
      reason: accountData.reason ?? undefined,
    },
  })
    .then(() => {
      table.value?.reloadData(accountList.value);
    })
    .finally(() => {
      close();
    });
};
</script>

<template>
  <div class="w-full h-full p-4 bg-default-100 rounded flex flex-col gap-4">
    <div class="flex-auto overflow-auto">
      <client-only>
        <vxe-table
          ref="table"
          :data="accountList"
          border
          keep-source
          height="100%"
          :edit-config="{
            trigger: 'click',
            mode: 'cell',
          }"
          :column-config="{
            resizable: true,
          }"
          @edit-closed="patch"
        >
          <vxe-column
            title="帐号ID"
            field="id"
            fixed="left"
          />
          <vxe-column
            title="帐号名"
            field="profile.name"
            :edit-render="{ name: 'input' }"
          />
          <vxe-column
            title="帐号简介"
            field="profile.bio"
            :edit-render="{ name: 'input' }"
          />
          <vxe-column
            title="是否禁用"
            field="ban"
          >
            <template #default="{ row: { ban } }">
              <span v-if="ban">
                禁用中
              </span>
              <span v-else>
                启用中
              </span>
            </template>
          </vxe-column>
          <vxe-column
            title="禁用结束日期"
            field="ban_expire"
          />
          <vxe-column
            title="封禁原因"
            field="reason"
          />
          <vxe-column
            title="操作列"
            :min-width="80"
            fixed="right"
          >
            <template #default="{ row }">
              <m-button
                class="text-nowrap"
                @click="() => info(row.id)"
              >
                高级修改
              </m-button>
            </template>
          </vxe-column>
        </vxe-table>
      </client-only>
      <account-info-modal
        v-if="isOpen"
        v-model="showAccountInfo"
        :data="accountInfo"
        @ok="onPatch"
      />
    </div>
    <div class="w-full flex-shrink-0 flex-grow-0 h-fit">
      <pagination
        :total-item="totalItems"
        @page-update="(cur) => to(cur)"
      />
    </div>
  </div>
</template>

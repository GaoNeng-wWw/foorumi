<script lang="ts" setup>
import { Button as MButton } from '@miraiui-org/vue-button';
import AccountInfoModal from './components/account-info-modal.vue';

const { accountList, showAccountInfo, accountInfo, patch, info } = useAccountList({});
</script>

<template>
  <div class="w-full h-full p-4 bg-default-100 rounded flex flex-col gap-4">
    <div class="w-full flex-shrink-0 flex-grow-0 h-fit">
      <m-button>
        添加用户
      </m-button>
    </div>
    <div class="flex-auto overflow-auto">
      <client-only>
        <vxe-table
          :data="accountList"
          border
          keep-source
          :edit-config="{
            trigger: 'click',
            mode: 'cell',
          }"
          @edit-closed="patch"
        >
          <vxe-column
            title="帐号ID"
            field="id"
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
        v-model="showAccountInfo"
        :data="accountInfo"
      />
    </div>
  </div>
</template>

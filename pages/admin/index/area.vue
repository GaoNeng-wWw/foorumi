<script lang="ts" setup>
import { Button as MButton } from '@miraiui-org/vue-button';
import type { Data } from '~/components/AppTable/table.type';

const data = Array.from<Data>({ length: 100 }).map((_, k) => ({ name: k, manager: 'a' }));
</script>

<template>
  <div class="w-full h-full bg-default-100 rounded-md">
    <div class="p-4 h-full">
      <app-table
        :data="data"
        class="h-full"
      >
        <app-table-column
          id="name"
          label="版区名称"
          :width="120"
          sortable
        />
        <app-table-column
          id="manager"
          label="版区管理员"
          :width="120"
        />
        <app-table-column
          id="action"
          label="操作"
          :width="120"
          extract
        />
        <template #extra>
          <m-button>
            删除
          </m-button>
        </template>
      </app-table>
    </div>
  </div>
</template>

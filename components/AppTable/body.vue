<script lang="ts" setup>
import { table } from './constant';
import type { Data, TableContext } from './table.type';

const { data, enableExtraColumn, border, columns } = inject<TableContext>(table)!;
const tableData = computed<Data>(() => data?.value ?? []);
enableExtraColumn.value = Boolean(useSlots().extra);
</script>

<template>
  <tbody class="overflow-auto h-auto">
    <tr
      v-for="row, rowIdx in tableData"
      :key="`row-${rowIdx}`"
      :data-border="border"
      class="group border-b border-b-foreground/40 text-foreground-800 hover:bg-default/20 transition duration-fast"
    >
      <template
        v-for="col, colIdx in columns"
        :key="`col-${colIdx}`"
      >
        <td
          v-if="!col.extract"
          class="text-center py-2 break-words px-2 last:border-r-0 group-data-[border=true]:border-r group-data-[border=true]:border-r-foreground/20"
        >
          {{ row[col.id] }}
        </td>
        <td
          v-else-if="$slots.extra"
          class="py-2 px-2"
        >
          <slot
            name="extra"
            :row="row"
          />
        </td>
      </template>
    </tr>
    <tr v-if="!data?.length">
      <td :colspan="columns?.length">
        <slot name="empty">
          <div class="w-full h-full flex items-center justify-center py-4">
            暂无数据
          </div>
        </slot>
      </td>
    </tr>
  </tbody>
</template>

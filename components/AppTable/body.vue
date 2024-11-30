<script lang="ts" setup>
import { table } from './constant';
import type { Data, TableContext } from './table.type';

const { data, enableExtraColumn } = inject<TableContext>(table)!;
const tableData = ref<Data>(data ?? []);
enableExtraColumn.value = Boolean(useSlots().extra);
</script>

<template>
  <tbody class="overflow-auto h-full">
    <tr
      v-for="row, rowIdx in tableData"
      :key="`row-${rowIdx}`"
      class="border-b border-b-foreground/50 last:border-b-0 text-foreground-800 hover:bg-default/20 transition duration-fast"
    >
      <td
        v-for="col, colIdx in row"
        :key="`col-${colIdx}`"
        class="text-center py-2 break-words px-2"
      >
        {{ col }}
      </td>
      <td
        v-if="$slots.extra"
        class="py-2 px-2"
      >
        <slot
          name="extra"
          :row="row"
        />
      </td>
    </tr>
  </tbody>
</template>

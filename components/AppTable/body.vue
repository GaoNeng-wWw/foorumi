<script lang="ts" setup>
import { table } from './constant';
import type { Data, TableContext } from './table.type';

const { getData, data } = inject<TableContext>(table)!;
const tableData = ref<Data>(data ?? []);

if (getData) {
  getData()
    .then((remoteData) => {
      tableData.value = remoteData;
    });
}
</script>

<template>
  <tbody>
    <tr
      v-for="row, rowIdx in tableData"
      :key="`row-${rowIdx}`"
      class="border-b border-b-foreground/50 last:border-b-0  text-foreground-800"
    >
      <td
        v-for="col, colIdx in row"
        :key="`col-${colIdx}`"
        class="text-center py-2 break-words px-2"
      >
        {{ col }}
      </td>
    </tr>
  </tbody>
</template>

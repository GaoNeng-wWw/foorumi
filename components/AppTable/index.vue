<script lang="ts" setup>
import { table } from './constant';
import type { TableContext, TableProps } from './table.type';

const props = defineProps<TableProps>();
const columns = ref(props.columns ?? []);
const data = ref(props.data ?? []);
provide<TableContext>(table, {
  columns,
  getData: props.getData,
  data,
});
</script>

<template>
  <div class="w-full border border-foreground/40 rounded-md">
    <table class="w-full break-words table-fixed">
      <colgroup>
        <col
          v-for="col, idx in columns"
          :key="col.id"
          :name="idx"
          :width="col.width"
        >
      </colgroup>
      <app-table-head />
      <app-table-body />
      <slot />
    </table>
  </div>
</template>

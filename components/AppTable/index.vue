<script lang="ts" setup>
import { table } from './constant';
import type { TableContext, TableProps } from './table.type';

const props = defineProps<TableProps>();
const columns = ref(props.columns ?? []);
const data = ref(props.data ?? []);
const enableExtraColumn = ref(false);
if (props.getData) {
  props.getData()
    .then((remoteData) => {
      data.value = remoteData;
    });
}

const onSort = (key: string, mode: '' | 'asc' | 'desc') => {
  if (!mode) {
    data.value = props.data ?? [];
    return;
  }
  data.value = data.value.toSorted((a, b) => {
    if (mode === 'asc') {
      return a[key] - b[key];
    }
    if (mode === 'desc') {
      return b[key] - a[key];
    }
    return 0;
  });
};

provide<TableContext>(table, {
  columns,
  data: computed(() => data.value),
  doSort: onSort,
  enableExtraColumn,
  border: computed(() => props.border),
});
watch(() => columns, () => {
  enableExtraColumn.value = columns.value.some(col => col.extract);
});
watch(() => props.columns, (oldColumn, newColumn) => {
  if (!oldColumn || !newColumn) {
    return;
  }
  columns.value = props.columns ?? [];
});
watch(() => props.data, () => {
  data.value = props.data ?? [];
});
</script>

<template>
  <div class="w-full h-fit border border-foreground/40 rounded-md overflow-auto relative">
    <table class="w-full break-words">
      <colgroup>
        <col
          v-for="col, idx in columns"
          :key="col.id"
          :name="idx"
          :width="col.width"
        >
      </colgroup>
      <app-table-head />
      <app-table-body>
        <template #extra="{ row }">
          <slot
            name="extra"
            :row="row"
          />
        </template>
        <template #empty>
          <slot name="empty" />
        </template>
      </app-table-body>
      <slot />
    </table>
  </div>
</template>

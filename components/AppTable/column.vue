<script lang="ts" setup>
import { table } from './constant';
import type { TableColumnProps, TableContext } from './table.type';

const { id, label, width } = defineProps<TableColumnProps>();
const {
  columns,
} = inject<TableContext>(table)!;
if (columns?.value) {
  columns.value.push({ id, label, width });
}
</script>

<!-- eslint-disable-next-line vue/valid-template-root -->
<template>
  <slot />
</template>

<script setup lang="ts">
import { table } from './constant';
import type { TableContext } from './table.type';

const { columns } = inject<TableContext>(table)!;

const tableHeader = computed(() => columns?.value ?? []);
</script>

<template>
  <thead class="border-b border-b-foreground/50">
    <tr>
      <th
        v-for="col, idx in tableHeader"
        :key="`col-${col.id}-${idx}`"
        class="py-2 px-2 last:border-r-0 text-foreground-700"
      >
        <div class="w-full flex items-center justify-center">
          {{ col.label }}
        </div>
      </th>
    </tr>
  </thead>
</template>

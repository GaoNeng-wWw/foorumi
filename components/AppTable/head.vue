<script setup lang="ts">
import { table } from './constant';
import type { TableContext } from './table.type';

const { columns, doSort, border } = inject<TableContext>(table)!;

const SORT_MODES = ['', 'asc', 'desc'] as const;
const tableHeader = computed(() => columns?.value);
const toggleSortmode = (id: string) => {
  const col = columns?.value.filter(col => col.id === id)[0];
  if (!col) {
    return;
  }
  if (col.sortable) {
    col.sortMode = SORT_MODES[(SORT_MODES.indexOf(col.sortMode ?? '') + 1) % SORT_MODES.length];
    doSort(col.id, col.sortMode);
  }
};
</script>

<template>
  <thead
    :data-border="border"
    class="sticky top-0 bg-default-200 group"
  >
    <tr>
      <th
        v-for="col, idx in tableHeader"
        :key="`col-${col.id}-${idx}`"
        class="
        py-3 px-2 text-foreground-700
        border-b border-b-foreground/50"
      >
        <div
          :data-hover-bg="col.sortable"
          :data-show-bg="Boolean(col.sortMode)"
          class="
          w-fit p-2 mx-auto flex items-center justify-center gap-2
          data-[hover-bg=true]:hover:bg-default cursor-pointer transition-all rounded-md
          data-[show-bg=true]:bg-default
          "
          @click="() => toggleSortmode(col.id)"
        >
          <span class="ml-2">
            {{ col.label }}
          </span>
          <icon-up-down
            v-if="col.sortable"
            :data-sort-mode="col.sortMode"
            class="group"
            up-class="size-5 font-bold group-data-[sort-mode='asc']:text-primary-500"
            down-class="size-5 text-foreground group-data-[sort-mode='desc']:text-primary-500"
          />
        </div>
      </th>
    </tr>
  </thead>
</template>

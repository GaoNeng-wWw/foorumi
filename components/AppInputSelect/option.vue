<script lang="ts" setup>
import { ComboboxItem } from 'radix-vue';
import type { OptionProps } from './option.props';

const props = defineProps<OptionProps>();
</script>

<template>
  <combobox-item
    :value="props"
    :disabled="props.disabled"
    class="
      group
      flex items-center px-6 text-tiny rounded-md cursor-pointer py-2 transition duration-fast
      data-[state='checked']:dark:bg-default-300 data-[state='checked']:bg-slate-100 last:mb-0 mb-1
      data-[disabled]:bg-opacity-70 data-[disabled]:text-foreground/70 data-[disabled]:cursor-not-allowed
      data-[disabled]:bg-transparent
      hover:bg-slate-100 dark:hover:bg-default-300 gap-2
    "
  >
    <slot name="prefix" />
    <slot> {{ props.label }} </slot>
    <slot name="suffix" />
  </combobox-item>
</template>

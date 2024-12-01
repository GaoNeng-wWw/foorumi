<script lang="ts" setup>
import { ComboboxGroup, ComboboxLabel, ComboboxSeparator } from 'radix-vue';
import type { GroupProps } from './group.props';

const { label, children = [] } = defineProps<GroupProps>();
</script>

<template>
  <combobox-group>
    <combobox-label class="px-4 py-2 text-tiny text-foreground/80">
      <slot name="label">
        {{ label }}
      </slot>
    </combobox-label>
    <slot>
      <app-input-select-option
        v-for="(child, idx) in children"
        :key="idx"
        :label="child.label"
        :value="child.value"
        :disabled="child.disabled"
      />
    </slot>
    <combobox-separator class="h-px m-1" />
  </combobox-group>
</template>

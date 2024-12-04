<script setup lang="ts">
import { ComboboxAnchor, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxRoot, ComboboxTrigger, ComboboxViewport } from 'radix-vue';
import { ChevronDownIcon, PlusIcon } from '@heroicons/vue/24/solid';
import type { InputSelectProps } from './index.props';
import type { OptionProps } from './option.props';

const { options, filter, err } = defineProps<InputSelectProps>();
const modelValue = defineModel<OptionProps | undefined>({ required: true });
</script>

<template>
  <ComboboxRoot
    v-model="modelValue"
    class="group"
    :display-value="(value) => !value?.label ? '' : value.label"
    :filter-function="filter"
    :data-err="err"
  >
    <ComboboxAnchor
      class="flex items-center justify-center"
    >
      <ComboboxTrigger class="flex p-2 items-center justify-around bg-default rounded w-full group-data-[err=true]:bg-danger/50">
        <slot name="prefix" />
        <ComboboxInput
          class="!bg-transparent outline-none h-full placeholder-foreground-700 text-sm w-[calc(100%_-_theme('size.8'))]"
          placeholder="Placeholder..."
        />
        <combobox-cancel
          v-if="modelValue"
          class="flex-shrink-0"
          @click="modelValue = undefined"
        >
          <slot name="cancel">
            <plus-icon class="size-4 text-foreground rotate-45" />
          </slot>
        </combobox-cancel>
        <slot name="suffix">
          <div class=" flex-grow-0 flex-shrink-0">
            <chevron-down-icon class="size-4 text-foreground" />
          </div>
        </slot>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <combobox-portal>
      <ComboboxContent
        position="popper"
        class="w-full mt-2 min-w-[160px] bg-default-200 bg-opacity-100 overflow-auto rounded border border-default-300 z-50"
      >
        <ComboboxViewport
          class="p-[5px]"
        >
          <ComboboxEmpty class="text-mauve8 text-xs font-medium text-center py-2">
            <slot name="empty" />
          </ComboboxEmpty>
          <slot>
            <template
              v-for="(option, idx) in options"
              :key="idx"
            >
              <app-input-select-group
                v-if="option.children?.length"
                :children="option.children"
                :label="option.label ?? ''"
              />
              <app-input-select-option
                v-else
                :label="option.label"
                :value="option.value"
              />
            </template>
          </slot>
        </ComboboxViewport>
      </ComboboxContent>
    </combobox-portal>
  </ComboboxRoot>
</template>

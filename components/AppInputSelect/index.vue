<script setup lang="ts">
import { ComboboxAnchor, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxRoot, ComboboxTrigger, ComboboxViewport } from 'radix-vue';
import { ChevronDownIcon, PlusIcon } from '@heroicons/vue/24/solid';
import type { InputSelectProps } from './index.props';
import type { OptionProps } from './option.props';

const { options, filter, err, maxHeight, multiple, showSelectAll, selectAllLabel } = defineProps<InputSelectProps>();
const modelValue = defineModel<OptionProps | OptionProps[] | undefined>({ required: true, default: [] });

const displayValue = (value: OptionProps<unknown>) => !value.label ? '' : value.label;
const tags = computed(() => {
  const staticModelValue = unref(modelValue);
  if (Array.isArray(staticModelValue)) {
    return staticModelValue.map(item => item.value);
  }
  return [staticModelValue?.value];
});
const tagsLabel = computed(() => {
  return tags.value.filter(v => v !== '__INTERNAL__SELECT__ALL').map(tag => options?.filter(opt => opt.value === tag)[0].label ?? '');
});
const selectAll = (ev) => {
  ev.preventDefault();
  if (!modelValue.value || !Array.isArray(modelValue.value)) {
    return;
  }
  if (modelValue.value.length > 0) {
    modelValue.value = [];
    return;
  }
  if (options?.length) {
    modelValue.value = options;
  }
};
</script>

<template>
  <ComboboxRoot
    v-model="modelValue"
    class="group"
    :display-value="displayValue"
    :filter-function="filter"
    :data-err="err"
    :multiple="multiple ?? false"
  >
    <ComboboxAnchor
      class="flex items-center justify-center"
    >
      <ComboboxTrigger class="flex p-2 items-center justify-around bg-default rounded w-full group-data-[err=true]:bg-danger/50">
        <slot name="prefix" />
        <div class="flex-auto">
          <ComboboxInput
            v-if="!multiple"
            class="!bg-transparent outline-none h-full placeholder-foreground-700 text-sm w-[calc(100%_-_theme('size.8'))]"
            placeholder="Placeholder..."
          />
          <tags-input-root
            v-else
            v-model="tags"
            class="flex gap-2 rounded flex-wrap"
            delimiter=""
          >
            <tags-input-item
              v-for="tag in tagsLabel"
              :key="tag"
              :value="tag"
              class=" px-2 py-px bg-primary rounded"
            >
              <tags-input-item-text class="text-sm" />
            </tags-input-item>
          </tags-input-root>
        </div>
        <div class="w-fit flex">
          <combobox-cancel
            v-if="modelValue"
            class="flex-shrink-0"
            @click="multiple ? modelValue = [] : modelValue = undefined"
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
        </div>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <combobox-portal>
      <ComboboxContent
        position="popper"
        class="w-full mt-2 min-w-[160px] bg-default-200 bg-opacity-100 rounded border border-default-300 z-50"
      >
        <scroll-area-root
          class="overflow-hidden"
          :style="{
            'height': `${maxHeight}px`,
            '--scrollbar-size': '10px',
          }"
        >
          <scroll-area-viewport class="w-full h-full">
            <ComboboxViewport
              class="p-[5px]"
            >
              <ComboboxEmpty class="text-mauve8 text-xs font-medium text-center py-2">
                <slot name="empty" />
              </ComboboxEmpty>
              <slot>
                <app-input-select-option
                  v-if="multiple && showSelectAll"
                  :label="selectAllLabel ?? '全选'"
                  :value="'__INTERNAL__SELECT__ALL'"
                  @select="selectAll"
                />
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
          </scroll-area-viewport>
          <ScrollAreaScrollbar
            class="flex select-none touch-none p-0.5 transition-colors duration-[160ms] ease-out hover:bg-blackA8 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
            orientation="vertical"
            force-mount
          >
            <ScrollAreaThumb
              class="flex-1 bg-foreground-500 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]"
            />
          </ScrollAreaScrollbar>
        </scroll-area-root>
      </ComboboxContent>
    </combobox-portal>
  </ComboboxRoot>
</template>

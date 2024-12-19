<script lang="ts" setup generic="T extends AcceptableValue">
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/solid';
import type { AppTagSelect } from './index.type';

const {
  options,
  multiple,
  maxHeight,
} = defineProps<AppTagSelect<T>>();
const modelValue = defineModel<T[]>({ required: true });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectedOptions: Ref<any[]> = ref([
  ...modelValue.value.map(v => v),
]);
const displayValue = (val: AcceptableValue) => {
  const opt = options.filter(opt => opt.value == val)[0];
  if (!opt) {
    return '';
  }
  return opt.label.toString();
};
const findValueByLabel = (label: string) => options.filter(opt => opt.label === label)[0].value;
const tags = computed(() => {
  if (!multiple) {
    return [displayValue(selectedOptions.value)];
  }
  return selectedOptions.value.map(v => displayValue(v));
});
const onSelect = (val: T | undefined) => {
  if (!val) {
    return;
  }
  if (selectedOptions.value.includes(val)) {
    selectedOptions.value = selectedOptions.value.filter(v => v !== val);
    return;
  }
  selectedOptions.value.push(val);
};
const selectAll = () => {
  if (selectedOptions.value.length) {
    selectedOptions.value = [];
    return;
  }
  selectedOptions.value = options.map(v => v.value);
};
const onRemove = (label: string | undefined) => {
  if (!label) {
    return;
  }
  selectedOptions.value = selectedOptions.value.filter(v => v !== findValueByLabel(label));
};
watch(selectedOptions, () => {
  modelValue.value = selectedOptions.value;
}, { immediate: true, deep: true });
const isSelectAll = computed(() => {
  const optionsValue = options.map(v => v.value);
  return selectedOptions.value.length === optionsValue.length && selectedOptions.value.every(val => optionsValue.includes(val));
});
</script>

<template>
  <combobox-root
    v-model="selectedOptions"
    class="group min-h-8 max-h-32"
    :multiple="multiple"
    :display-value="displayValue"
  >
    <combobox-anchor class="flex items-start justify-center h-full max-h-32">
      <combobox-trigger class="flex p-2 overflow-auto items-start justify-around bg-default rounded w-full min-h-8 max-h-32">
        <tags-input-root
          class="flex gap-2 rounded flex-wrap h-full"
          delimiter=""
        >
          <tags-input-item
            v-for="tag in tags"
            :key="tag"
            :value="tag"
            class="h-fit px-2 py-px bg-primary rounded text-primary-foreground flex gap-2 items-center"
          >
            <tags-input-item-text class="text-sm" />
            <tags-input-item-delete
              class="p-0.5 bg-transparent"
              @click="() => onRemove(tag)"
            >
              <x-mark-icon class="size-3 text-primary-foreground" />
            </tags-input-item-delete>
          </tags-input-item>
        </tags-input-root>
      </combobox-trigger>
    </combobox-anchor>

    <combobox-portal>
      <combobox-content
        position="popper"
        class="w-full h-full mt-2 min-w-[160px] bg-default-200 bg-opacity-100 rounded border border-default-300 z-50"
      >
        <scroll-area-root
          class="overflow-hidden"
          :style="{
            'height': `${maxHeight}px`,
            '--scrollbar-size': '10px',
          }"
        >
          <scroll-area-viewport class="w-full h-full">
            <combobox-viewport
              class="p-2"
            >
              <!-- TODO: I18N -->
              <combobox-item
                value="__SELECT__INTERNAL__SELECT_ALL__"
                label="全选"
                class="
                  flex px-6 text-tiny rounded-md cursor-pointer py-2 transition duration-fast
                  data-[state='checked']:dark:bg-default-300 data-[state='checked']:bg-slate-100 last:mb-0 mb-1
                  data-[disabled]:bg-opacity-70 data-[disabled]:text-foreground/70 data-[disabled]:cursor-not-allowed
                  data-[disabled]:bg-transparent
                  hover:bg-slate-100 dark:hover:bg-default-300 gap-2
                "
                @select.prevent="selectAll"
              >
                <checkbox-root
                  v-if="multiple"
                  class="w-5 h-5 border border-default-500 rounded group data-[state='checked']:border-primary"
                  :checked="isSelectAll"
                >
                  <template #default="{ checked }">
                    <checkbox-indicator
                      class="
                        bg-default w-full h-full flex items-center justify-center transition duration-normal
                        data-[state='checked']:bg-primary
                      "
                      force-mount
                    >
                      <transition
                        enter-active-class="transition duration-normal ease-epic"
                        leave-active-class="transition duration-normal ease-epic"
                        enter-from-class="scale-0"
                        enter-to-class="scale-100"
                        leave-from-class="scale-100"
                        leave-to-class="scale-0"
                      >
                        <check-icon
                          v-if="checked"
                          class="size-4 text-primary-foreground"
                        />
                      </transition>
                    </checkbox-indicator>
                  </template>
                </checkbox-root>
                全选
              </combobox-item>
              <template
                v-for="(opt, idx) in options"
                :key="idx"
              >
                <combobox-item
                  :value="opt.value"
                  :label="opt.label"
                  class="
                    flex items-center px-6 text-tiny rounded-md cursor-pointer py-2 transition duration-fast
                    data-[state='checked']:dark:bg-default-300 data-[state='checked']:bg-slate-100 last:mb-0 mb-1
                    data-[disabled]:bg-opacity-70 data-[disabled]:text-foreground/70 data-[disabled]:cursor-not-allowed
                    data-[disabled]:bg-transparent
                    hover:bg-slate-100 dark:hover:bg-default-300 gap-2
                  "
                  @select.prevent="({ detail: { value } }) => onSelect(value)"
                >
                  <checkbox-root
                    v-if="multiple"
                    class="w-5 h-5 border border-default-500 rounded group data-[state='checked']:border-primary"
                    :checked="selectedOptions.includes(opt.value)"
                  >
                    <template #default="{ checked }">
                      <checkbox-indicator
                        class="
                        bg-default w-full h-full flex items-center justify-center transition duration-normal
                        data-[state='checked']:bg-primary
                      "
                        force-mount
                      >
                        <transition
                          enter-active-class="transition duration-normal ease-epic"
                          leave-active-class="transition duration-normal ease-epic"
                          enter-from-class="scale-0"
                          enter-to-class="scale-100"
                          leave-from-class="scale-100"
                          leave-to-class="scale-0"
                        >
                          <check-icon
                            v-if="checked"
                            class="size-4 text-primary-foreground"
                          />
                        </transition>
                      </checkbox-indicator>
                    </template>
                  </checkbox-root>
                  {{ opt.label }}
                </combobox-item>
              </template>
            </combobox-viewport>
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
      </combobox-content>
    </combobox-portal>
  </combobox-root>
</template>

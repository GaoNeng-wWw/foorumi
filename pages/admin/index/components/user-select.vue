<script lang="ts" setup>
type PointerDownOutsideEvent = CustomEvent<{ originalEvent: PointerEvent }>;
type UserOption = {
  label: string;
  value: number;
};

const modelValue = defineModel<number>();
const modelOption = defineModel<UserOption | undefined>('option');

const searchText = useThrottle(ref(''), 200);
const searchInput = useTemplateRef('searchInput');
const { accountList, next, page, totalItems, size, loading } = useAccountList({ initializationPage: 1, name: searchText });
let oldAccountList: UserOption[] = [];
const userOptions = computed<UserOption[]>(() => {
  if (!accountList.value.length) {
    return [];
  }
  if (searchText.value) {
    return accountList.value.map<UserOption>((account) => {
      return {
        label: account.profile?.name ?? '',
        value: account.id,
      };
    });
  }
  return oldAccountList.concat(
    accountList.value.map<UserOption>((account) => {
      return {
        label: account.profile?.name ?? '',
        value: account.id,
      };
    }),
  );
});
const seletcedOptions = ref<UserOption | undefined>(modelOption.value);
const canLoadMore = () => (page.value * size.value) < totalItems.value && !loading.value;
const loadMore = () => {
  oldAccountList = oldAccountList.concat(
    accountList.value.map(account => ({
      label: account.profile?.name ?? '',
      value: account.id,
    })),
  );
  next();
};
const contentVisibility = ref(false);
const onClickOutside = (ev: PointerDownOutsideEvent) => {
  const target = ev.target;
  if (!target || !(target instanceof Element)) {
    contentVisibility.value = false;
    return;
  }
  if (!target.matches('[data-trigger]')) {
    contentVisibility.value = false;
  }
  return;
};
const onInputFocus = () => {
  if (!searchInput.value) {
    oldAccountList = [];
    return;
  }
  nextTick(() => {
    if (!searchInput.value) {
      return;
    }
    searchInput.value.focus();
  });
  contentVisibility.value = true;
};
watch(seletcedOptions, () => {
  if (!seletcedOptions.value) {
    searchText.value = '';
    return;
  }
  searchText.value = seletcedOptions.value.label;
  modelValue.value = seletcedOptions.value.value;
  modelOption.value = seletcedOptions.value;
}, { immediate: true, deep: true });

watch(searchText, () => {
  page.value = 1;
  oldAccountList = [];
  if (searchText.value === '') {
    seletcedOptions.value = undefined;
  }
});
</script>

<template>
  <popover-root
    :open="contentVisibility"
    as-child
  >
    <popover-anchor
      as-child
    >
      <div class="flex w-full h-full rounded bg-default gap-2 px-2">
        <popover-trigger class="w-full">
          <input
            ref="searchInput"
            v-model="searchText"
            class="w-full h-full p-2 text-left bg-transparent outline-none"
            type="text"
            data-trigger
            @focus="onInputFocus"
          >
        </popover-trigger>
      </div>
    </popover-anchor>
    <popover-portal
      v-if="contentVisibility"
      tabindex="-1"
    >
      <popover-content
        class="w-[--radix-popover-trigger-width] bg-default rounded"
        :side-offset="8"
        force-mount
        @pointer-down-outside="onClickOutside"
      >
        <listbox-root
          v-if="userOptions.length"
          v-model="seletcedOptions"
          tabindex="-2"
        >
          <div class="max-h-28 overflow-auto">
            <app-infinite-scroll
              :load-more="loadMore"
              :can-load-more="canLoadMore"
            >
              <listbox-content class="p-2">
                <listbox-virtualizer
                  v-slot="{ option }"
                  :options="userOptions"
                  class="flex flex-col"
                  :estimate-size="44"
                >
                  <listbox-item
                    :value="option"
                    :text-content="(opt:UserOption) => opt.label"
                    class="
                      w-full hover:bg-default-400 h-9 px-2 py-1 rounded cursor-pointer text-foreground data-[state=checked]:bg-primary
                      flex items-center data-[state=checked]:text-primary-foreground
                    "
                  >
                    {{ option.label }}
                  </listbox-item>
                </listbox-virtualizer>
              </listbox-content>
            </app-infinite-scroll>
          </div>
        </listbox-root>
        <slot
          v-else-if="!loading"
          name="empty"
        >
          <div class="w-full py-8 flex justify-center">
            未找到相关用户
          </div>
        </slot>
      </popover-content>
    </popover-portal>
  </popover-root>
</template>

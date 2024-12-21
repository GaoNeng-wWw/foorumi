<script lang="ts" setup>
import { vOnClickOutside } from '@vueuse/components';

const modelValue = defineModel<number>();

type UserOption = {
  label: string;
  value: number;
};
const searchText = ref('');
const { accountList, next, page, totalItems, size, loading } = useAccountList({ initializationPage: 1, name: searchText });
let oldAccountList: UserOption[] = [];
const userOptions = computed<UserOption[]>(() => {
  return oldAccountList.concat(
    accountList.value.map<UserOption>((account) => {
      return {
        label: account.profile?.name ?? '',
        value: account.id,
      };
    }),
  );
});
const seletcedOptions = ref({ label: 'ret0', value: 1 });
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
watch(seletcedOptions, () => {
  if (!seletcedOptions.value) {
    searchText.value = '';
    return;
  }
  searchText.value = seletcedOptions.value.label;
}, { immediate: true, deep: true });
</script>

<template>
  <popover-root
    v-on-click-outside="() => console.log('outside')"
    :open="contentVisibility"
    as-child
  >
    <popover-anchor
      as-child
    >
      <div class="flex w-full h-full rounded bg-default gap-2 px-2">
        <input
          v-model="searchText"
          class="w-full h-full p-2 text-left bg-transparent outline-none"
          type="text"
          tabindex="-1"
        >
        <popover-trigger>
          <button
            @click="contentVisibility = !contentVisibility"
          >
            aaa
          </button>
        </popover-trigger>
      </div>
    </popover-anchor>
    <popover-portal>
      <popover-content
        class="w-[--radix-popover-trigger-width] bg-default rounded"
        :side-offset="8"
        tabindex="-1"
        disable-outside-pointer-events
        @pointer-down-outside="() => contentVisibility = false"
      >
        <listbox-root
          v-model="seletcedOptions"
          tabindex="-1"
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
                >
                  <listbox-item
                    :value="option"
                    :text-content="(opt:UserOption) => opt.label"
                    class="w-full hover:bg-default-200 p-1 px-2 rounded cursor-pointer data-[state=checked]:bg-default-200"
                  >
                    {{ option.label }}
                  </listbox-item>
                </listbox-virtualizer>
              </listbox-content>
            </app-infinite-scroll>
          </div>
        </listbox-root>
      </popover-content>
    </popover-portal>
  </popover-root>
</template>

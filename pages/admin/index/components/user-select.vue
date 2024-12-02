<script lang="ts" setup>
import type { OptionProps } from '~/components/AppInputSelect/option.props';

const { defaultId = -1 } = defineProps<{
  defaultId?: number;
}>();

const page = ref(1);
const modelValue = defineModel<OptionProps>({ required: false });
const onSearch = (options: Omit<OptionProps<string>, 'disabled'>[], term: string) => {
  return options.filter(opt => opt.label && opt.label.toLowerCase().includes(term));
};
const { accountList: rawAccountList } = useAccountList({ initializationPage: page });
const accountList: Ref<{
  value: number;
  label: string;
}[]> = ref([]);
watch(rawAccountList, () => {
  if (!rawAccountList.value?.data) {
    return;
  }
  accountList.value = [
    ...rawAccountList.value.data
      .map((item) => {
        if (!item.profile) {
          return null;
        }
        return {
          value: item.id,
          label: item.profile.name,
        };
      })
      .filter(val => val !== null),
  ];
});
watch(() => [defaultId, rawAccountList], () => {
  if (!rawAccountList.value) {
    return;
  }
  const account = rawAccountList.value.data.filter(account => account.id === defaultId)[0];
  if (!account || !account.profile) {
    return;
  }
  modelValue.value = {
    value: account.id,
    label: account.profile.name,
  };
}, { immediate: true, deep: true });
</script>

<template>
  <app-input-select
    v-model="modelValue"
    :options="accountList"
    :filter="onSearch"
  />
</template>

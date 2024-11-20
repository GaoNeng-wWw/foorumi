<script setup lang="ts">
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid';

const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    labelPosition?: 'top' | 'left';
    label?: string;
    labelStyle?: Record<string, string>;
  }>(),
  {
    size: 'md',
    showLabel: false,
    labelPosition: 'top',
    lable: '',
    labelStyle: () => ({}),
  },
);

const modelValue = defineModel<string>({ required: true });
const type = ref<'text' | 'password'>('password');
</script>

<template>
  <base-input
    v-bind="props"
    v-model="modelValue"
    :type="type"
  >
    <template #suffix>
      <div
        class="p-2"
        @pointerdown="type = 'text'"
        @pointerup="type='password'"
      >
        <eye-icon
          v-if="type === 'password'"
          class="size-6 text-foreground cursor-pointer"
        />
        <eye-slash-icon
          v-else
          class="size-6 text-foreground cursor-pointer"
        />
      </div>
    </template>
  </base-input>
</template>

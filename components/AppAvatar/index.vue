<script lang="ts" setup>
import { cva } from 'class-variance-authority';

const avatar = cva(['aspect-square object-contain'], {
  variants: {
    size: {
      xs: ['w-8'],
      sm: ['w-16'],
      md: ['w-20'],
      lg: ['w-24'],
    },
    rounded: {
      sm: 'rounded-sm',
      md: 'rounded',
      lg: 'rounded-md',
      full: 'rounded-full',
    },
  },
});

const props = defineProps<{
  id: string | number;
  defaultUrl?: string;
  size: 'xs' | 'sm' | 'md' | 'lg';
  rounded: 'sm' | 'md' | 'lg' | 'full';
}>();

const emits = defineEmits<{
  error: [Event];
  click: [Event];
}>();

const className = computed(() => avatar(props));
const avatarUrl = ref(props.defaultUrl ?? '/images/a4fa5161369727154bc3a7d1c52bb9c0.png');
$fetch(`/api/avatar/${props.id}`, { method: 'get' })
  .then(resp => resp as Blob)
  .then(blob => URL.createObjectURL(blob))
  .then(url => avatarUrl.value = url)
  .catch(() => {});
</script>

<template>
  <img
    :src="avatarUrl"
    :class="className"
    @error="(ev) => emits('error', ev)"
    @click="(ev) => emits('click', ev)"
  >
</template>

<script lang="ts" setup>
import { ExclamationTriangleIcon } from '@heroicons/vue/24/solid';

const {
  type,
  title,
  content,
} = defineProps<{
  type: 'warning' | 'info' | 'success';
  title: string;
  content: string;
}>();
</script>

<template>
  <div
    :data-alert-type="type"
    class="
      group
      w-full px-2 py-4 rounded-md
      data-[alert-type='warning']:bg-warning/20
      data-[alert-type='success']:bg-success/20
      data-[alert-type='info']:bg-primary/20
    "
  >
    <div
      class="
    flex items-center gap-2
    group-data-[alert-type='warning']:text-warning
    group-data-[alert-type='success']:text-success
    group-data-[alert-type='info']:text-primary-500
    "
    >
      <slot name="icon">
        <exclamation-triangle-icon class="size-5 shrink-0" />
      </slot>
      <slot name="title">
        <span class="font-bold tracking-wide ">{{ title }}</span>
      </slot>
    </div>
    <div
      class="
      px-7 break-all
      group-data-[alert-type='warning']:text-warning-800
      group-data-[alert-type='success']:text-success-800
      group-data-[alert-type='info']:text-primary-800
    "
    >
      <slot>
        {{ content }}
      </slot>
    </div>
  </div>
</template>

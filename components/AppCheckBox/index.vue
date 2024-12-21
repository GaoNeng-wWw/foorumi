<script lang="ts" setup>
import { CheckIcon } from '@heroicons/vue/24/solid';

const modelValue = defineModel<boolean | undefined>({ required: false, default: false });
</script>

<template>
  <checkbox-root
    v-model:checked="modelValue"
    class="w-5 h-5 border border-default-500 rounded group data-[state='checked']:border-primary"
  >
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
          v-if="modelValue"
          class="size-4 text-primary-foreground"
        />
      </transition>
    </checkbox-indicator>
  </checkbox-root>
</template>

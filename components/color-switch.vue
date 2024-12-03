<script setup lang="ts">
import { MoonIcon, SunIcon } from '@heroicons/vue/24/solid';
import { VxeUI } from 'vxe-table';

const mode = useColorMode();

watch(mode, () => {
  VxeUI.setTheme(mode.value === 'light' ? 'light' : 'dark');
}, { immediate: true, deep: true });
</script>

<template>
  <color-scheme>
    <transition
      enter-active-class="transition duration-300"
      leave-active-class="transition duration-300"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-1"
      leave-from-class="translate-y-0 opacity-1"
      leave-to-class="translate-y-2 opacity-0"
      mode="out-in"
    >
      <sun-icon
        v-if="$colorMode.value === 'light'"
        key="sun"
        class="size-6 cursor-pointer"
        @click="$colorMode.value = 'dark'"
      />
      <moon-icon
        v-else
        key="moon"
        class="size-6 cursor-pointer"
        @click="$colorMode.value = 'light'"
      />
    </transition>
  </color-scheme>
</template>

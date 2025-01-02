<script lang="ts" setup>
import { DrawerContent, DrawerOverlay, DrawerPortal, DrawerRoot, type DrawerDirection } from 'vaul-vue';

const modelValue = defineModel<boolean>({ required: true, default: false });
const { direction, shouldScaleBackground = false, width = '50%', height = '100%', transparent = false } = defineProps<{
  direction: DrawerDirection;
  width?: string;
  height?: string;
  shouldScaleBackground?: boolean;
  transparent?: boolean;
}>();
</script>

<template>
  <DrawerRoot
    v-model:open="modelValue"
    :should-scale-background="shouldScaleBackground"
    :direction="direction"
  >
    <DrawerPortal>
      <DrawerOverlay class="fixed bg-black/40 inset-0 z-[100]" />
      <DrawerContent
        :data-direction="direction"
        :data-x="direction === 'left' || direction==='right'"
        :data-transparent="transparent"
        aria-describedby="undefined"
        :style="{
          '--width': width,
          '--height': height,
        }"
        class="
          fixed bottom-0 bg-default-200 border-none outline-none flex flex-col h-full z-[200]
          data-[direction='left']:left-0
          data-[direction='right']:right-0
          data-[x=true]:w-[var(--width)]
          data-[x=true]:h-full
          data-[x=false]:h-[var(--height)]
          data-[x=false]:w-[var(--width)]
          data-[transparent=true]:!bg-transparent
        "
      >
        <slot />
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>

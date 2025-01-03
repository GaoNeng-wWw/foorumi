<script lang="ts" setup>
import { useForwardProps, type PopoverContentProps } from 'radix-vue';

const open = defineModel<boolean>('open', { required: false, default: false });

const props = defineProps<PopoverContentProps & {
  triggerClass?: string;
  contentClass?: string;
  rootClass?: string;
  contentFollowTriggerWidth?: boolean;
  destory?: boolean;
}>();
const forwardProps = useForwardProps(props);
</script>

<template>
  <popover-root
    v-model:open="open"
    :data-popover="true"
    :class="['w-full', props.rootClass]"
  >
    <popover-trigger
      :class="['w-fit', props.rootClass]"
    >
      <slot name="trigger" />
    </popover-trigger>
    <popover-portal>
      <popover-content
        :data-content-follow-trigger="props.contentFollowTriggerWidth"
        :class="['w-fit data-[content-follow-trigger=true]:w-[var(--radix-popover-trigger-width)]', props.contentClass]"
        v-bind="{ ...forwardProps, ...$attrs }"
        :force-mount="props.forceMount"
      >
        <transition
          enter-active-class="transition duration-normal"
          leave-active-class="transition duration-normal"
          enter-from-class="-translate-y-5 opacity-0"
          enter-to-class="translate-y-0"
          leave-from-class="translate-y-0"
          leave-to-class="-translate-y-5 opacity-0"
        >
          <template v-if="destory">
            <div
              v-if="open"
            >
              <slot />
            </div>
          </template>
          <template v-else>
            <div
              v-show="open"
            >
              <slot />
            </div>
          </template>
        </transition>
      </popover-content>
    </popover-portal>
  </popover-root>
</template>

<style>
div[data-radix-popper-content-wrapper] {
  z-index: 999 !important;
}
</style>

<script lang="ts" setup>
const {
  canLoadMore = true,
  loadMore,
  threshold = 0.1,
} = defineProps<{
  canLoadMore?: (() => boolean) | (() => Promise<boolean>) | boolean;
  loadMore?: () => void;
  threshold?: number;
}>();

const trigger = useTemplateRef('trigger');
const realCanloadMore = ref();

const checkCanLoad = () => {
  if (typeof canLoadMore === 'boolean') {
    realCanloadMore.value = canLoadMore;
    return;
  }
  const p = canLoadMore();
  if (p instanceof Promise) {
    p.then(val => realCanloadMore.value = val);
  } else {
    realCanloadMore.value = p;
  }
};

const { stop } = useIntersectionObserver(trigger, (entry) => {
  if (entry[0].isIntersecting) {
    checkCanLoad();
    if (realCanloadMore.value) {
      loadMore?.();
    }
  }
}, { threshold });

defineExpose({ stop });

onMounted(() => {
  checkCanLoad();
});
</script>

<template>
  <scroll-area-root class="w-full h-full rounded-md overflow-hidden">
    <scroll-area-viewport class="w-full h-full">
      <div
        class="w-full h-full"
      >
        <div class="h-full">
          <slot />
        </div>
        <div
          ref="trigger"
          class="w-full trigger"
        >
          <slot
            name="empty"
          />
        </div>
      </div>
    </scroll-area-viewport>
    <ScrollAreaScrollbar
      class="flex select-none relative touch-none p-0.5 ease-out data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
      orientation="vertical"
    >
      <ScrollAreaThumb
        class="flex-1 bg-default rounded-[10px] before:content-[''] before:absolute before:top-1/2 before:left-full before:-translate-x-1/2 before:-translate-y-full before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]"
      />
    </ScrollAreaScrollbar>
  </scroll-area-root>
</template>

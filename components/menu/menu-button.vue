<script lang="ts" setup>
const { active = false } = defineProps<{
  active?: boolean;
}>();
</script>

<template>
  <div
    :data-active="active"
    class="
    flex gap-2 items-center w-full
    hover:bg-default
    cursor-pointer p-2 rounded-md text-ellipsis whitespace-nowrap overflow-hidden
    data-[active=true]:bg-default
    "
  >
    <div
      v-if="$slots.prefix"
      class="w-fit"
    >
      <slot name="prefix" />
    </div>
    <div class="flex-auto text-ellipsis w-full overflow-hidden">
      <slot />
    </div>
    <div
      v-if="$slots.suffix"
      class="w-fit flex-auto"
    >
      <slot name="suffix" />
    </div>
  </div>
</template>

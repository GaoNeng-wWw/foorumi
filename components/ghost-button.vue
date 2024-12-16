<script lang="ts" setup>
const { active = false } = defineProps<{
  active?: boolean;
}>();
</script>

<template>
  <div
    :data-active="active"
    class="w-fit p-2 data-[active=true]:bg-default/50 hover:bg-default/50 transition cursor-pointer rounded"
  >
    <slot />
  </div>
</template>

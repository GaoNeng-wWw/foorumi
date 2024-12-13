<script lang="ts" setup>
const { title } = defineProps<{
  title?: string;
}>();

const emits = defineEmits<{
  prefixClick: [];
  suffixClick: [];
}>();
</script>

<template>
  <div class="flex gap-2 items-center justify-center-gap-8 mb-4 px-4">
    <div class="w-full flex gap-2 items-center">
      <slot
        name="prefix"
        @click="() => emits('prefixClick')"
      />
      <h1
        class="text-2xl leading-none line-clamp-1"
        :title="title"
      >
        {{ title }}
      </h1>
    </div>
    <div class="flex-shrink-0">
      <slot
        name="suffix"
        @click="() => emits('suffixClick')"
      />
    </div>
  </div>
</template>

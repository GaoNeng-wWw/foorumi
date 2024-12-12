<script lang="ts" setup>
const showReply = defineModel<boolean>();
const { floor } = defineProps<{
  floor: string;
}>();
const emits = defineEmits<{
  reply: [];
}>();
const onClickReply = () => {
  showReply.value = !showReply.value;
  emits('reply');
};
</script>

<template>
  <div class="w-full mt-2 flex">
    <div class="ml-auto space-x-4">
      <span>举报</span>
      <div class="space-x-2 inline-block">
        <span>#{{ floor }}</span>
        <span
          class="cursor-pointer"
          @click="onClickReply"
        >回复</span>
      </div>
    </div>
  </div>
</template>

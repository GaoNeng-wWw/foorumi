<script lang="ts" setup>
const { leaf = true } = defineProps<{
  leaf?: boolean;
}>();
</script>

<template>
  <div
    :data-leaf="leaf"
    class="w-full data-[leaf=false]:grid data-[leaf=false]grid-cols-[40px_minmax(0,1fr)] data-[leaf=false]gap-2"
  >
    <div class="w-full space-y-2">
      <div class=" grid grid-cols-[40px_minmax(0,1fr)] items-center gap-2">
        <div class="size-10 shrink-0 bg-red-500" />
        <p class=" font-bold">
          User A
        </p>
      </div>
      <div class="space-y-2 grid grid-cols-[40px_minmax(0,1fr)] gap-2">
        <div />
        <div>
          <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Est culpa sunt, exercitationem illo animi autem aliquam voluptatibus quas et inventore dolores, non soluta reiciendis maiores nostrum quisquam fuga dolorum nemo!</span>
          <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Est culpa sunt, exercitationem illo animi autem aliquam voluptatibus quas et inventore dolores, non soluta reiciendis maiores nostrum quisquam fuga dolorum nemo!</span>
          <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Est culpa sunt, exercitationem illo animi autem aliquam voluptatibus quas et inventore dolores, non soluta reiciendis maiores nostrum quisquam fuga dolorum nemo!</span>
        </div>
      </div>
      <div class="mt-2 grid grid-cols-[40px_minmax(0,1fr)] gap-2">
        <div />
        <div>
          <span class=" dark:text-blue-400 text-blue-500 cursor-pointer">回复</span>
        </div>
      </div>
      <div class="grid grid-cols-[40px_minmax(0,1fr)] gap-2">
        <div />
        <!-- Children -->
      </div>
    </div>
  </div>
</template>

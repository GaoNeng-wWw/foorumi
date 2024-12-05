<script lang="ts" setup>
import { Button as MButton } from '@miraiui-org/vue-button';

const { treeData } = useAreaTree();

definePageMeta({
  auth: true,
});
</script>

<template>
  <nuxt-layout
    name="side"
    aside-sticky
    direction="ltr"
  >
    <div class="w-full h-full">
      <post-list />
    </div>
    <template
      #aside
    >
      <div class="py-4 flex flex-col gap-4">
        <div>
          <m-button :type="'primary'">
            发布帖子
          </m-button>
        </div>
        <div class="opacity-80 hover:opacity-100 transition duration-normal">
          <tree-context>
            <tree
              :data="treeData"
            />
          </tree-context>
        </div>
      </div>
    </template>
  </nuxt-layout>
</template>

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
    <div class="w-full py-4 space-y-4">
      <post-item
        author="ret0"
        author-id="11"
        floor="255"
        pin
        title="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat dicta, hic ad corporis voluptate eaque fugit ullam omnis possimus enim quos quae aspernatur esse et beatae nulla deserunt eveniet maiores?"
      />
      <post-item
        author="ret0"
        author-id="11"
        floor="255"
        pin
        title="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat dicta, hic ad corporis voluptate eaque fugit ullam omnis possimus enim quos quae aspernatur esse et beatae nulla deserunt eveniet maiores?"
      />
      <post-item
        author="ret0"
        author-id="11"
        floor="255"
        pin
        title="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat dicta, hic ad corporis voluptate eaque fugit ullam omnis possimus enim quos quae aspernatur esse et beatae nulla deserunt eveniet maiores?"
      />
      <post-item
        author="ret0"
        author-id="11"
        floor="255"
        pin
        title="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat dicta, hic ad corporis voluptate eaque fugit ullam omnis possimus enim quos quae aspernatur esse et beatae nulla deserunt eveniet maiores?"
      />
      <post-item
        author="ret0"
        author-id="11"
        floor="255"
        pin
        title="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat dicta, hic ad corporis voluptate eaque fugit ullam omnis possimus enim quos quae aspernatur esse et beatae nulla deserunt eveniet maiores?"
      />
      <post-item
        author="ret0"
        author-id="11"
        floor="255"
        pin
        title="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat dicta, hic ad corporis voluptate eaque fugit ullam omnis possimus enim quos quae aspernatur esse et beatae nulla deserunt eveniet maiores?"
      />
      <post-item
        author="ret0"
        author-id="11"
        floor="255"
        pin
        title="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat dicta, hic ad corporis voluptate eaque fugit ullam omnis possimus enim quos quae aspernatur esse et beatae nulla deserunt eveniet maiores?"
      />
      <post-item
        author="ret0"
        author-id="11"
        floor="255"
        pin
        title="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat dicta, hic ad corporis voluptate eaque fugit ullam omnis possimus enim quos quae aspernatur esse et beatae nulla deserunt eveniet maiores?"
      />
      <post-item
        author="ret0"
        author-id="11"
        floor="255"
        pin
        title="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat dicta, hic ad corporis voluptate eaque fugit ullam omnis possimus enim quos quae aspernatur esse et beatae nulla deserunt eveniet maiores?"
      />
      <post-item
        author="ret0"
        author-id="11"
        floor="255"
        pin
        title="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat dicta, hic ad corporis voluptate eaque fugit ullam omnis possimus enim quos quae aspernatur esse et beatae nulla deserunt eveniet maiores?"
      />
      <post-item
        author="ret0"
        author-id="11"
        floor="255"
        pin
        title="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat dicta, hic ad corporis voluptate eaque fugit ullam omnis possimus enim quos quae aspernatur esse et beatae nulla deserunt eveniet maiores?"
      />
      <post-item
        author="ret0"
        author-id="11"
        floor="255"
        pin
        title="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat dicta, hic ad corporis voluptate eaque fugit ullam omnis possimus enim quos quae aspernatur esse et beatae nulla deserunt eveniet maiores?"
      />
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

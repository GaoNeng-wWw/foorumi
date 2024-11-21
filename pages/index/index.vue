<script lang="ts" setup>
import { Button as MButton } from '@miraiui-org/vue-button';
</script>

<template>
  <nuxt-layout
    name="side"
    aisde-sticky
  >
    <div class="w-full py-4 space-y-4">
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
      <div class="hidden sm:block">
        <div>
          <m-button :type="'primary'">
            发布帖子
          </m-button>
        </div>
      </div>
    </template>
  </nuxt-layout>
</template>

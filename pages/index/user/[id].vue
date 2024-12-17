<script lang="ts" setup>
import userHeader from './components/user-header.vue';
import userPosts from './components/user-posts.vue';

const route = useRoute();
const { params: { id } } = route;
</script>

<template>
  <div class="max-w-6xl mx-auto pt-4 ">
    <nuxt-layout
      name="side"
      aside-external-class="hidden sm:block"
      section-external-class="flex-auto w-full"
    >
      <div class="space-y-4">
        <div class="w-full border border-foreground/10 bg-default-200 rounded-md">
          <user-header :id="id.toString()" />
        </div>
        <user-posts
          :id="id.toString()"
          class="border border-foreground/10"
        />
      </div>
      <template #aside>
        <div class="w-full p-2 rounded-md bg-default-200 border border-foreground/10">
          <h2 class="text-xl font-medium">
            个人成就
          </h2>
          <ul class="px-5 mt-2">
            <li>内测用户</li>
          </ul>
        </div>
      </template>
    </nuxt-layout>
  </div>
</template>

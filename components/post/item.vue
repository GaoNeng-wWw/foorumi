<script setup lang="ts">
import { MapPinIcon } from '@heroicons/vue/24/solid';
import { Tag as MTag } from '@miraiui-org/vue-tag';

const { pin = false, pinTips = '置顶', postId = '', authorId = '' } = defineProps<{
  pin?: boolean;
  pinTips?: string;
  author?: string;
  authorId?: string;
  areas?: string[];
  floor?: number | string;
  title?: string;
  postId?: string;
}>();
</script>

<template>
  <article class="w-full p-2 border-b border-b-default-400/60 dark:border-b-default-500 space-y-2">
    <div class="flex items-center gap-2 flex-wrap">
      <div class="flex gap-2 flex-grow flex-shrink basis-auto sm:basis-0 items-center">
        <div class="hidden sm:flex gap-1 items-center">
          <tag
            v-if="floor"
            :value="floor"
          />
          <map-pin-icon
            v-if="pin"
            class="size-6 fill-danger mb-1"
          />
        </div>
        <div class="flex-auto">
          <nuxt-link
            :to="`/post/${postId}`"
            class="hover:text-primary hover:dark:text-blue-500 transition text-foreground-800"
          >
            <h1 class="line-clamp-2 sm:line-clamp-1 text-lg">
              {{ title }}
            </h1>
          </nuxt-link>
        </div>
      </div>
      <div class="flex flex-wrap grow-0 shrink-0 w-fit gap-2 items-center">
        <nuxt-link :to="`/user/${authorId}`">
          <span
            v-if="author"
            class="text-foreground text-opacity-90 text-sm hover:text-primary hover:dark:text-blue-500 transition"
          >
            @{{ author }}
          </span>
        </nuxt-link>
        <m-tag
          v-if="pin"
          size="sm"
          colors="danger"
          class="block sm:hidden text-nowrap text-sm leading-none bg-opacity-80 text-opacity-80"
        >
          {{ pinTips }}
        </m-tag>
        <m-tag
          v-for="(area, idx) in areas"
          :key="idx"
          size="sm"
          class="text-nowrap text-sm leading-none bg-opacity-80 text-opacity-80"
        >
          {{ area }}
        </m-tag>
        <m-tag
          v-if="floor"
          size="sm"
          class="text-nowrap text-sm leading-none bg-opacity-80 text-opacity-80 sm:hidden"
        >
          {{ floor }} 楼
        </m-tag>
      </div>
    </div>
  </article>
</template>

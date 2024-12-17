<script lang="ts" setup>
const { id } = defineProps<{ id: string }>();
const { postList, canLoadMore, nextPage } = usePostList({
  authorId: computed(() => Number.parseInt(id.toString())),
  type: computed(() => 'new'),
});
const formatDate = (date: string) => new Date(date).toLocaleDateString();
</script>

<template>
  <div class="w-full p-4 bg-default-200 rounded-md">
    <h1 class="text-xl">
      发布的帖子
    </h1>
    <div class="w-full space-y-2 mt-2">
      <app-infinite-scroll
        :can-load-more="canLoadMore"
        :load-more="nextPage"
      >
        <nuxt-link
          v-for="post in postList"
          :key="post.id"
          :to="`/post/${post.id}`"
          class="text-lg mt-2 block"
        >
          <div
            class="
              py-1 px-3 cursor-pointer rounded-md transition duration-normal border border-transparent
              hover:border-foreground/10 hover:bg-default
              "
          >
            <div>
              {{ post.title }}
            </div>
            <div>
              <span class="text-sm text-foreground-700">
                {{ formatDate(post.create_at) }}
              </span>
            </div>
          </div>
        </nuxt-link>
      </app-infinite-scroll>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { area, pageSize = 20 } = defineProps<{
  area?: string;
  pageSize?: number;
  pin?: boolean;
}>();
const { postList, canLoadMore, loading: listLoading, nextPage } = usePostList({
  pageSize: computed(() => pageSize),
  area: computed(() => area),
});
const { postList: pinPostList, loading: pinLoading } = usePostList({
  pageSize: computed(() => pageSize),
  area: computed(() => area),
  pin: true,
});
</script>

<template>
  <div class="w-full h-full overflow-hidden py-4 space-y-4 flex flex-col">
    <div class="px-4">
      <post-item
        v-for="item in pinPostList"
        v-show="!pinLoading"
        :key="item.id"
        :post-id="item.id"
        :title="item.title"
        :author="item.author.name"
        :author-id="item.author_id.toString()"
        :pin="item.pin"
        :floor="item.floors"
      />
    </div>
    <app-infinite-scroll
      :can-load-more="canLoadMore"
      :load-more="nextPage"
      class="px-4 h-full"
    >
      <post-item
        v-for="item in postList"
        :key="item.id"
        :post-id="item.id"
        :title="item.title"
        :author="item.author.name"
        :author-id="item.author_id.toString()"
        :pin="item.pin"
        :floor="item.floors"
      />
      <template #empty>
        <div
          v-if="!listLoading"
          class="w-full text-center"
        >
          没有更多帖子了
        </div>
      </template>
    </app-infinite-scroll>
  </div>
</template>

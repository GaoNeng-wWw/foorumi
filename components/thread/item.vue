<script lang="ts" setup>
const showReply = ref(false);

const { showHeader = false, showToolBar = true, showAside = true } = defineProps<{
  showHeader?: boolean;
  showToolBar?: boolean;
  showAside?: boolean;
}>();
</script>

<template>
  <div class="w-full z-0 group first:pt-4">
    <thread-header
      v-if="showHeader"
      title="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus eos asperiores itaque omnis quam, iure delectus beatae quia, voluptate sed sequi ad cupiditate eligendi ipsam? Deleniti a eligendi inventore sint."
    >
      <template #prefix>
        <slot name="title-prefix" />
      </template>
      <template #suffix>
        <slot name="title-suffix" />
      </template>
    </thread-header>
    <div class="w-full px-4 grid grid-cols-[120px,minmax(0,1fr)]">
      <thread-aside
        v-if="showAside"
        :author-id="1"
        author-name="Author"
      />
      <div class="px-4 py-4 bg-default-200 border-b border-default-400">
        <div class="text-base text-foreground leading-7">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus eos asperiores itaque omnis quam, iure delectus beatae quia, voluptate sed sequi ad cupiditate eligendi ipsam? Deleniti a eligendi inventore sint.
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus eos asperiores itaque omnis quam, iure delectus beatae quia, voluptate sed sequi ad cupiditate eligendi ipsam? Deleniti a eligendi inventore sint.
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus eos asperiores itaque omnis quam, iure delectus beatae quia, voluptate sed sequi ad cupiditate eligendi ipsam? Deleniti a eligendi inventore sint.
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus eos asperiores itaque omnis quam, iure delectus beatae quia, voluptate sed sequi ad cupiditate eligendi ipsam? Deleniti a eligendi inventore sint.
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus eos asperiores itaque omnis quam, iure delectus beatae quia, voluptate sed sequi ad cupiditate eligendi ipsam? Deleniti a eligendi inventore sint.
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus eos asperiores itaque omnis quam, iure delectus beatae quia, voluptate sed sequi ad cupiditate eligendi ipsam? Deleniti a eligendi inventore sint.
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus eos asperiores itaque omnis quam, iure delectus beatae quia, voluptate sed sequi ad cupiditate eligendi ipsam? Deleniti a eligendi inventore sint.
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus eos asperiores itaque omnis quam, iure delectus beatae quia, voluptate sed sequi ad cupiditate eligendi ipsam? Deleniti a eligendi inventore sint.
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus eos asperiores itaque omnis quam, iure delectus beatae quia, voluptate sed sequi ad cupiditate eligendi ipsam? Deleniti a eligendi inventore sint.
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus eos asperiores itaque omnis quam, iure delectus beatae quia, voluptate sed sequi ad cupiditate eligendi ipsam? Deleniti a eligendi inventore sint.
        </div>
        <thread-toolbar
          v-if="showToolBar"
          v-model="showReply"
        />
        <div class="w-full">
          <reply-list
            :show="showReply"
            class="border-0 bg-default-300"
          />
        </div>
      </div>
    </div>
  </div>
</template>

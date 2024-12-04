<script lang="ts" setup>
export interface SideBarData {
  label: string;
  link?: string;
  children?: SideBarData[];
}
const { data = [] } = defineProps<{
  data?: SideBarData[];
}>();
</script>

<template>
  <div class="w-full h-full bg-default-100 flex flex-col">
    <div class="w-full grow p-2">
      <div class="w-full h-full">
        <menu>
          <menu-item
            v-for="(item, idx) in data"
            :key="idx"
          >
            <nuxt-link
              v-if="item.link"
              :to="item.link"
            >
              <menu-button :active="$route.path === item.link">
                {{ item.label }}
              </menu-button>
            </nuxt-link>
          </menu-item>
        </menu>
      </div>
    </div>
    <div class="self-center h-fit mb-0 mt-auto py-4">
      <color-switch />
    </div>
  </div>
</template>

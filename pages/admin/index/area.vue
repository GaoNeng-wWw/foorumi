<script lang="ts" setup>
import { Button as MButton } from '@miraiui-org/vue-button';
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'radix-vue';

const { data: rawAreas } = await useFetch('/api/area', { method: 'get' });
const page = ref(1);
useAccountList({ initializationPage: page });
const areaData = reactive({
  name: '',
});
const areas = ref<AreaTable[]>([]);
watch(rawAreas, () => {
  if (!rawAreas.value) {
    return;
  }
  areas.value = rawAreas.value?.map((v) => {
    return {
      name: v.name,
      manager: v.manager.name,
      manager_id: v.manager_id,
    };
  });
});
const onAdd = () => {
  areas.value.push({
    name: areaData.name,
    manager: 'D',
    manager_id: -1,
  });
};
const manager = ref();
</script>

<template>
  <div class="w-full h-full bg-default-100 rounded-md">
    <div class="p-4 flex flex-col h-full gap-4">
      <div class="w-full py-2 px-1">
        <popover-root id="add-area">
          <popover-trigger id="add-area-trigger">
            <m-button type="primary">
              添加
            </m-button>
          </popover-trigger>
          <popover-portal id="add-area-protal">
            <popover-content
              id="add-area-form"
              :side-offset="8"
              class="p-4 rounded bg-default-200 data-[state=open]:animate-fade-up data-[state=closed]:translate-y-8 data-[state=closed]:opacity-0 space-y-2"
            >
              <base-input
                v-model="areaData.name"
                show-label
                label="板区名称"
              />
              <m-button @click="onAdd">
                添加
              </m-button>
            </popover-content>
          </popover-portal>
        </popover-root>
      </div>
      <app-table
        :data="areas"
        border
        class="h-full"
      >
        <app-table-column
          id="name"
          label="版区名称"
          :width="120"
          sortable
        />
        <app-table-column
          id="manager"
          label="版区管理员"
          :width="120"
        />
        <app-table-column
          id="action"
          label="操作"
          :width="120"
          extract
        />
        <template #extra>
          <m-button>
            删除
          </m-button>
        </template>
      </app-table>
      <div class="ml-auto mr-0">
        <pagination />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Modal } from '@miraiui-org/vue-modal';
import { Button as MButton } from '@miraiui-org/vue-button';
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'radix-vue';
import UpdateAreaModal from './components/update-area-modal.vue';
import UserSelect from './components/user-select.vue';
import type { OptionProps } from '~/components/AppInputSelect/option.props';

const { areaList: rawAreas, totalItems, areaPage } = useAreaList({});

const manager = ref<OptionProps>();

const areaData = reactive({
  name: '',
  manager_id: '',
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
      id: v.id,
    };
  }) ?? [];
}, { immediate: true, deep: true });
const addArea = () => {
  if (!manager.value) {
    return;
  }
  const { value } = manager.value;
  areaData.manager_id = value;
  $fetch('/api/area', {
    method: 'put',
    body: {
      name: areaData.name,
      manager_id: areaData.manager_id,
    },
    onResponse({ response: { _data } }) {
      if (!manager.value) {
        return;
      }
      areas.value.push({
        name: _data.name,
        manager: manager.value.label!,
        manager_id: manager.value.value!,
        id: _data.id,
      });
      manager.value = undefined;
    },
  });
};
const updateAreaModalVisible = ref(false);
const currentRow = ref<AreaTable>();
const updateArea = (row: AreaTable) => {
  updateAreaModalVisible.value = true;
  currentRow.value = { ...row };
};
const onOk = (newData: AreaTable) => {
  const idx = areas.value.findIndex(item => item.id === newData.id);
  if (idx === -1) {
    return;
  }
  areas.value.splice(idx, 1, { ...newData });
  updateAreaModalVisible.value = false;
};
</script>

<template>
  <div class="w-full h-full bg-default-100 rounded-md">
    <div class="p-4 flex flex-col h-full gap-4">
      <client-only>
        <div class="w-full py-2 px-1">
          <popover-root id="add-area">
            <popover-trigger id="add-area-trigger">
              <m-button type="primary">
                添加
              </m-button>
            </popover-trigger>
            <popover-portal>
              <popover-content
                :side-offset="8"
                class="p-4 rounded bg-default-200 data-[state=open]:animate-fade-up data-[state=closed]:translate-y-8 data-[state=closed]:opacity-0 space-y-2"
              >
                <base-input
                  v-model="areaData.name"
                  show-label
                  label="板区名称"
                />

                <user-select v-model="manager" />

                <m-button
                  type="primary"
                  @click="addArea"
                >
                  确认
                </m-button>
              </popover-content>
            </popover-portal>
          </popover-root>
        </div>
      </client-only>
      <app-table
        :data="areas"
        border
        class="h-full"
      >
        <app-table-column
          id="id"
          label="ID"
          :width="60"
          sortable
        />
        <app-table-column
          id="name"
          label="版区名称"
          :width="120"
        />
        <app-table-column
          id="manager"
          label="版区管理员"
          :width="120"
        />
        <app-table-column
          id="action"
          label="操作"
          :width="60"
          extract
        />
        <template #extra="{ row }">
          <div class="space-x-4">
            <m-button @click="() => updateArea(row)">
              修改
            </m-button>
            <m-button type="danger">
              删除
            </m-button>
          </div>
        </template>
      </app-table>
      <div class="ml-auto mr-0">
        <pagination
          :total-item="totalItems"
          @page-update="(currentPage) => areaPage = currentPage"
        />
      </div>
    </div>
    <Modal v-model="updateAreaModalVisible">
      <update-area-modal
        v-if="currentRow"
        :manager-id="currentRow.manager_id"
        :area-name="currentRow.name"
        :area-id="currentRow.id"
        @cancel="() => updateAreaModalVisible = false"
        @ok="onOk"
      />
      <template
        #footer
      >
        <div />
      </template>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import type { DateValue } from '@internationalized/date';

const modelValue = defineModel<string | null>();
const date = ref<DateValue>();

const updateDate = () => {
  modelValue.value = date.value?.toString();
};
</script>

<template>
  <DatePickerRoot
    id="date-field"
    v-model="date"
    :locale="'zh'"
    @update:model-value="updateDate"
  >
    <DatePickerField
      v-slot="{ segments }"
      class="
        flex select-none bg-default items-center justify-between
        rounded-lg text-center text-foreground
        border border-transparent p-1 min-w-40 data-[invalid]:border-danger
      "
    >
      <div class="flex items-center">
        <template
          v-for="item in segments"
          :key="item.part"
        >
          <DatePickerInput
            v-if="item.part === 'literal'"
            :part="item.part"
          >
            {{ item.value }}
          </DatePickerInput>
          <DatePickerInput
            v-else
            :part="item.part"
            class="rounded-md p-0.5 focus:outline-none data-[placeholder]:text-foreground"
          >
            {{ item.value }}
          </DatePickerInput>
        </template>
      </div>

      <DatePickerTrigger class="rounded-md text-xl p-1">
        <Icon icon="radix-icons:calendar" />
      </DatePickerTrigger>
    </DatePickerField>

    <DatePickerContent
      :side-offset="4"
      class="
      rounded-xl bg-default
      "
    >
      <DatePickerArrow class="fill-foreground" />
      <DatePickerCalendar
        v-slot="{ weekDays, grid }"
        class="p-4"
      >
        <DatePickerHeader class="flex items-center justify-between">
          <DatePickerPrev
            class="
            inline-flex items-center cursor-pointer text-foreground justify-center rounded-[9px] bg-transparent w-8 h-8
            hover:bg-default-200 hover:text-white active:scale-[0.95] active:transition-all"
          >
            <Icon
              icon="radix-icons:chevron-left"
              class="w-6 h-6"
            />
          </DatePickerPrev>

          <DatePickerHeading class="text-foreground font-medium" />
          <DatePickerNext
            class="
            inline-flex items-center cursor-pointer text-foregruond justify-center rounded-[9px] bg-transparent w-8 h-8
            hover:bg-default-200 hover:text-white active:scale-[0.95] active:transition-all"
          >
            <Icon
              icon="radix-icons:chevron-right"
              class="w-6 h-6"
            />
          </DatePickerNext>
        </DatePickerHeader>
        <div
          class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0"
        >
          <DatePickerGrid
            v-for="month in grid"
            :key="month.value.toString()"
            class="w-full border-collapse select-none space-y-1"
          >
            <DatePickerGridHead>
              <DatePickerGridRow class="mb-1 flex w-full justify-between">
                <DatePickerHeadCell
                  v-for="day in weekDays"
                  :key="day"
                  class="w-8 rounded-md text-xs text-green8"
                >
                  {{ day }}
                </DatePickerHeadCell>
              </DatePickerGridRow>
            </DatePickerGridHead>
            <DatePickerGridBody>
              <DatePickerGridRow
                v-for="(weekDates, index) in month.rows"
                :key="`weekDate-${index}`"
                class="flex w-full"
              >
                <DatePickerCell
                  v-for="weekDate in weekDates"
                  :key="weekDate.toString()"
                  :date="weekDate"
                >
                  <DatePickerCellTrigger
                    :day="weekDate"
                    :month="month.value"
                    class="
                    relative flex items-center justify-center whitespace-nowrap rounded-[9px] border border-transparent bg-transparent text-sm font-normal
                    text-foreground w-8 h-8 outline-none hover:border-foreground data-[selected]:bg-default-100
                    data-[selected]:font-medium data-[disabled]:text-foreground/30 data-[selected]:text-foreground
                    data-[unavailable]:pointer-events-none
                    data-[unavailable]:text-foreground/30 data-[unavailable]:line-through
                    before:absolute before:bottom-0.5 before:hidden before:rounded-full before:w-1.5 before:h-1.5
                    before:bg-default-100 data-[today]:before:block data-[today]:before:bg-primary data-[selected]:before:bg-default
                    "
                  />
                </DatePickerCell>
              </DatePickerGridRow>
            </DatePickerGridBody>
          </DatePickerGrid>
        </div>
      </DatePickerCalendar>
    </DatePickerContent>
  </DatePickerRoot>
</template>

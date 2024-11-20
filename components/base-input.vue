<script setup lang="ts">
type TriggerMethod = 'input' | 'focus' | 'blur' | 'click';
const props = withDefaults(
  defineProps<{
    type?: 'text' | 'password';
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    labelPosition?: 'top' | 'left';
    label?: string;
    labelStyle?: Record<string, string>;
    validator?: (val: string) => boolean | Promise<boolean>;
    errorMessage?: string;
    description?: string;
    trigger?: TriggerMethod | TriggerMethod[];
    required?: boolean;
  }>(),
  {
    type: 'text',
    size: 'md',
    showLabel: false,
    labelPosition: 'top',
    lable: '',
    labelStyle: () => ({}),
    trigger: () => ([]),
  },
);

const triggerMethod = computed(() => typeof props.trigger === 'string' ? [props.trigger] : props.trigger);
const { type, size, showLabel, labelPosition } = toRefs(props);
const modelValue = defineModel<string>({ required: true });
const invalid = ref(false);
const error = computed(() => invalid.value);
const tip = computed(() => error.value ? props.errorMessage : props.description);

const setInvalid = () => {
  const v = props.validator?.(modelValue.value);
  if (v instanceof Promise) {
    v.then(valid => invalid.value = !valid);
  } else {
    invalid.value = !v;
  }
};

const onInput = () => {
  if (triggerMethod.value.includes('input')) {
    setInvalid();
  }
};
const onFocus = () => {
  if (triggerMethod.value.includes('focus')) {
    setInvalid();
  }
};

const onBlur = () => {
  if (triggerMethod.value.includes('blur')) {
    setInvalid();
  }
};

const onClick = () => {
  if (triggerMethod.value.includes('click')) {
    setInvalid();
  }
};
</script>

<template>
  <div
    class="w-full flex gap-2 group"
    :class="{
      'flex-col': labelPosition === 'top',
    }"
    :data-error="invalid"
  >
    <label
      v-if="showLabel"
      class="text-foreground"
    >{{ label }}</label>
    <div
      class="flex items-center w-full"
      :class="{
        'bg-danger/50': error,
        'bg-default': !error,
      }"
    >
      <input
        v-model="modelValue"
        class="w-full outline-none border-none text-foreground transition bg-transparent"
        :class="{
          'py-1 px-2': size === 'sm',
          'py-2 px-3': size === 'md',
          'py-3 px-4': size === 'lg',
        }"
        :type="type"
        @focus="onFocus"
        @blur="onBlur"
        @input="onInput"
        @click="onClick"
      >
      <div>
        <slot name="suffix" />
      </div>
    </div>
    <span
      v-if="tip"
      class="group-data-[error=true]:text-danger text-sm font-bold leading-none"
    >{{ tip }}</span>
  </div>
</template>

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
    err?: boolean;
    requireIcon?: boolean;
    descClass?: string;
  }>(),
  {
    type: 'text',
    size: 'md',
    showLabel: false,
    labelPosition: 'top',
    lable: '',
    labelStyle: () => ({}),
    trigger: () => ([]),
    err: false,
    requiredIcon: false,
    descClass: 'font-bold leading-none"',
  },
);

const showRequireIcon = computed(() => props.requireIcon || props.required);
const emits = defineEmits(['blur', 'input', 'forcus', 'click']);

const triggerMethod = computed(() => typeof props.trigger === 'string' ? [props.trigger] : props.trigger);
const { type, size, showLabel, labelPosition } = toRefs(props);
const modelValue = defineModel<string>({ required: true });
const invalid = ref(props.err);
if (props.err) {
  watch(() => props.err, () => {
    invalid.value = props.err;
  });
}
const error = computed(() => invalid.value);
const tip = computed(() => error.value ? props.errorMessage : props.description);
const validator = props.validator ?? (props.required ? (val: string) => Boolean(val.length) : () => true);

const setInvalid = () => {
  const v = validator(modelValue.value);
  if (v instanceof Promise) {
    v.then(valid => invalid.value = !valid);
  } else {
    invalid.value = !v;
  }
};

const onInput = () => {
  emits('input');
  if (triggerMethod.value.includes('input')) {
    setInvalid();
  }
};
const onFocus = () => {
  emits('forcus');
  if (triggerMethod.value.includes('focus')) {
    setInvalid();
  }
};

const onBlur = () => {
  emits('blur');
  if (triggerMethod.value.includes('blur')) {
    setInvalid();
  }
};

const onClick = () => {
  emits('click');
  if (triggerMethod.value.includes('click')) {
    setInvalid();
  }
};

defineExpose({ error, valid: setInvalid });
</script>

<template>
  <div
    class="w-full flex gap-2 group h-fit"
    :class="{
      'flex-col': labelPosition === 'top',
    }"
    :data-error="invalid"
  >
    <label
      v-if="showLabel"
      class="text-foreground"
    >
      {{ label }}
      <span
        v-if="showRequireIcon"
        class="text-danger"
      >*</span>
    </label>
    <div
      class="flex items-center w-full"
      :class="{
        'bg-danger/50': error,
        'bg-default': !error,
      }"
    >
      <div>
        <slot name="prefix" />
      </div>
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
      class="group-data-[error=true]:text-danger text-sm"
      :class="descClass"
    >{{ tip }}</span>
  </div>
</template>

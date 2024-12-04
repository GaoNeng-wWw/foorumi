import { describe, expect, it } from 'vitest';
import { ref, nextTick } from 'vue';
import { useForm } from '../useForm';

describe('useForm', () => {
  it('schema (async)', () => {
    const model = ref<{
      age: string | number;
      name: string | number;
    }>({
      age: 'a',
      name: 1,
    });
    const { errors, clearInvalid } = useForm({
      model,
      schema: {
        age: async (val: unknown) => {
          return {
            error: typeof val !== 'number',
            reason: 'Age type should tobe number but is ' + typeof val,
          };
        },
        name: async () => {
          return {
            error: true,
            reason: 'error field',
          };
        },
      },
      immediate: true,
    });
    expect(errors.value?.age).not.toBeNull();
    model.value.age = 1;
    nextTick(() => {
      expect(errors.value?.age).not.toBeDefined();
      expect(errors.value?.name).toBeDefined();
      clearInvalid();
    });
    nextTick(() => {
      expect(errors.value).toBeNull();
    });
  });
  it('defaultValue', () => {
    const model = ref<{
      age: string | number;
      name: string | number;
    }>({
      age: 'a',
      name: 1,
    });
    const { errors } = useForm({
      model,
      schema: {
        age: (val: unknown) => {
          return {
            error: typeof val !== 'number',
            reason: 'Age type should tobe number but is ' + typeof val,
          };
        },
        name: () => {
          return {
            error: true,
            reason: 'error field',
          };
        },
      },
      immediate: true,
    });
    expect(errors.value?.age).not.toBeNull();
    model.value.age = 1;
    setTimeout(() => {
      expect(errors.value?.age).not.toBeDefined();
      expect(errors.value?.name).toBeDefined();
    }, 0);
  });
  it('clear invalid status', () => {
    const model = ref<{
      age: string | number;
      name: string | number;
    }>({
      age: 'a',
      name: 1,
    });
    const { errors, clearInvalid } = useForm({
      model,
      schema: {
        age: (val: unknown) => {
          return {
            error: typeof val !== 'number',
            reason: 'Age type should tobe number but is ' + typeof val,
          };
        },
        name: () => {
          return {
            error: true,
            reason: 'error field',
          };
        },
      },
      immediate: true,
    });
    expect(errors.value?.age).not.toBeNull();
    model.value.age = 1;
    nextTick(() => {
      expect(errors.value?.age).not.toBeDefined();
      expect(errors.value?.name).toBeDefined();
      clearInvalid();
    });
    nextTick(() => {
      expect(errors.value).toBeNull();
    });
  });
  it('setValue', () => {
    const model = ref<{
      age: string | number;
      name: string | number;
    }>({
      age: 'a',
      name: 1,
    });
    const { errors, clearInvalid, setValue } = useForm({
      model,
      schema: {
        age: (val: unknown) => {
          return {
            error: typeof val !== 'number',
            reason: 'Age type should tobe number but is ' + typeof val,
          };
        },
        name: () => {
          return {
            error: true,
            reason: 'error field',
          };
        },
      },
      immediate: true,
    });
    expect(errors.value?.age).not.toBeNull();
    setValue('age', '1');
    nextTick(() => {
      expect(errors.value?.age).toBeDefined();
      expect(errors.value?.name).toBeDefined();
      clearInvalid();
    });
    nextTick(() => {
      expect(errors.value).toBeNull();
    });
  });
  it('unSetError', () => {
    const model = ref<{
      age: string | number;
      name: string | number;
    }>({
      age: 'a',
      name: 1,
    });
    const { unSetError, errors } = useForm({
      model,
      schema: {
        age: (val: unknown) => {
          return {
            error: typeof val !== 'number',
            reason: 'Age type should tobe number but is ' + typeof val,
          };
        },
        name: () => {
          return {
            error: true,
            reason: 'error field',
          };
        },
      },
      immediate: true,
    });
    expect(errors.value?.name).toBeDefined();
    unSetError('name');
    nextTick(() => {
      expect(errors.value?.name).toBeUndefined();
    });
  });
  it('setError', () => {
    const model = ref<{
      age: string | number;
      name: string | number;
    }>({
      age: 1,
      name: 'a',
    });
    const { setError, errors, clearInvalid, unSetError } = useForm({
      model,
      schema: {
        age: (val: unknown) => {
          return {
            error: typeof val !== 'number',
            reason: 'Age type should tobe number but is ' + typeof val,
          };
        },
        name: () => {
          return {
            error: true,
            reason: 'error field',
          };
        },
      },
      immediate: true,
    });
    expect(errors.value?.age).toBeUndefined();
    setError('age', 'reason');
    nextTick(() => {
      expect(errors.value?.age).toBe('reason');
      clearInvalid();
    });
    nextTick(() => {
      expect(errors.value).toBeNull();
      setError('age', 'reason');
      unSetError('age');
    });
    nextTick(() => {
      expect(errors.value?.age).toBeUndefined();
    });
  });
  it('onSubmit', () => {
    const model = ref<{
      age: string | number;
      name: string | number;
    }>({
      age: 1,
      name: 'a',
    });
    const { errors, onSubmit } = useForm({
      model,
      schema: {
        age: (val: unknown) => {
          return {
            error: typeof val !== 'number',
            reason: 'Age type should tobe number but is ' + typeof val,
          };
        },
        name: () => {
          return {
            error: true,
            reason: 'error field',
          };
        },
      },
      immediate: true,
    });
    expect(errors.value?.age).toBeUndefined();
    onSubmit((_model, errors) => {
      _model.age = 'c';
      expect(errors?.age).toBeUndefined();
      expect(model.value.age).not.toBe(_model.age);
    });
  });
});

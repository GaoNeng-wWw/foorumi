import type { Reactive } from 'vue';
import { ref, unref, watch } from 'vue';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SafeObject = Record<string, any>;

type Validator<T = unknown> = (
  (val: T) => {
    error: boolean;
    reason?: string;
  }
) | (
  (val: T) => Promise<
    {
      error: boolean;
      reason?: string;
    }
  >
);

export type UseFormOptions<M extends SafeObject = SafeObject> = {
  defaultValue?: {
    [k in keyof M]?: M[k]
  };
  model: Reactive<M> | Ref<M>;
  schema?: {
    [k in keyof M]?: Validator<unknown> & {};
  };
  immediate?: boolean;
} & {};

export type Errors<M extends SafeObject = SafeObject> = {
  [k in keyof M]?: string
} | null;

export type UseFormReturn<M extends SafeObject = SafeObject> = {
  // ok
  errors: Ref<Errors<M> | null>;
  onSubmit: (
    cb?: (model: M, errors: Errors<M>) => void
  ) => void;
  // ok
  setValue: <K extends keyof M>(key: K, value: M[K]) => void;
  verify: () => Ref<Errors<M> | null>;
  // ok
  clearInvalid: () => void;
  // ok
  setError: (field: string, value: string) => void;
  // ok
  unSetError: (field: string) => void;
  // ok
  formModel: Ref<M>;
};

export const useForm = <M extends SafeObject>({ model, defaultValue = {}, schema, immediate = false }: UseFormOptions<M>): UseFormReturn<M> => {
  const formModel: Ref<M> = ref({
    ...defaultValue,
    ...unref(model),
  });
  const errors = ref<Errors>(null);
  const setError = (field: string, reason: string) => {
    if (errors.value === null) {
      errors.value = {
        [field]: reason,
      };
    } else {
      errors.value[field] = reason;
    }
  };
  const verify = () => {
    if (!schema) {
      return errors;
    }
    for (const [key, value] of Object.entries(unref(formModel))) {
      const validtor = schema[key];
      if (!(typeof validtor === 'function')) {
        continue;
      }
      const verifyRes = validtor(value);
      if (verifyRes instanceof Promise) {
        verifyRes.then((res) => {
          if (res.error) {
            setError(key, res.reason ?? '');
          }
        });
      } else if (verifyRes.error) {
        setError(key, verifyRes.reason ?? '');
      }
    }
    return errors;
  };
  const onSubmit = (
    cb?: (model: M, errors: Errors<M>) => void,
  ) => {
    clearInvalid();
    verify();
    cb?.({ ...unref(model) }, errors.value);
  };
  const clearInvalid = () => {
    errors.value = null;
  };
  const setValue = <K extends keyof M>(key: K, value: M[K]) => {
    formModel.value[key] = value;
  };
  const unSetError = (field: string) => {
    if (!errors.value) {
      return;
    }
    errors.value[field] = undefined;
  };
  if (immediate) {
    verify();
  }

  watch(formModel, () => {
    clearInvalid();
    verify();
  }, { deep: true });

  watch(model, () => {
    formModel.value = {
      ...formModel.value,
      ...unref(model),
    };
  }, { deep: true });

  return {
    setValue,
    clearInvalid,
    verify,
    setError,
    errors,
    onSubmit,
    formModel,
    unSetError,
  };
};

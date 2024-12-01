// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface OptionProps<T = any> {
  value: T;
  label?: string;
  disabled?: boolean;
}

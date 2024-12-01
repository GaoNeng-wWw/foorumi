import type { ComboboxRootProps } from 'radix-vue';
import type { OptionProps } from './option.props';

export interface InputSelectProps {
  options?: (OptionProps & { children?: OptionProps[] })[] & {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter?: ComboboxRootProps<any>['filterFunction'];
}

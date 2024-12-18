import type { ComboboxRootProps } from 'radix-vue';
import type { OptionProps } from './option.props';

export type InputSelectOptions = (OptionProps & { children?: OptionProps[] })[] & {};

export interface InputSelectProps {
  options?: InputSelectOptions;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter?: ComboboxRootProps<any>['filterFunction'];

  err?: boolean;

  maxHeight?: number;

  multiple?: boolean;
  showSelectAll?: boolean;
  selectAllLabel?: string;
}

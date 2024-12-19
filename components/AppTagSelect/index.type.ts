export type AppTagSelectOption<T extends AcceptableValue> = {
  label: string;
  value: T;
};

export interface AppTagSelect<T extends AcceptableValue> {
  options: AppTagSelectOption<T>[];
  multiple?: boolean;
  maxHeight?: number;
}

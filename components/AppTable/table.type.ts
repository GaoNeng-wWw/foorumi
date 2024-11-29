export type Index = {
  id: string;
  label: string;
  width: number;
};
export type Data = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [field: string]: any;
};
export type TableProps = {
  getData?: <T = Data>() => Promise<T>;
  loading?: boolean;
  columns?: Index[];
  data?: Data[];
};
export type TableColumnProps = Index & {};

export type TableContext = {
  getData: TableProps['getData'];
  columns?: Ref<Index[]>;
  data?: Ref<Data[]>;
};

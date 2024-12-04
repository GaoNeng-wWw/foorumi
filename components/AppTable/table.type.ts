export type Index = {
  id: string;
  label: string;
  width?: number;
  sortable?: boolean;
  sortMode?: '' | 'asc' | 'desc';
  extract?: boolean;
};
export type Data = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [field: string]: any;
};
export type TableProps = {
  getData?: <T = Data[]>() => Promise<T>;
  loading?: boolean;
  columns?: Index[];
  data?: Data[];
  extractWidth?: number;
  extractTitle?: string;
  border?: boolean;
};
export type TableColumnProps = Index & {};

export type TableContext = {
  columns?: Ref<Index[]>;
  data?: ComputedRef<Data[]>;
  doSort: (key: string, mode: '' | 'asc' | 'desc') => void;
  enableExtraColumn: Ref<boolean>;
  border: Ref<boolean>;
};

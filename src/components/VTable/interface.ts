export interface DataType {
  key: string | number;
  [propName: string]: string | number;
}

export interface ColumnsType {
  key: string | number;
  title: unknown;
  dataIndex: string;
  width?: number;
}

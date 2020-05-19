
export interface Phone {
  [key: string]: any;
  age: number;
  id: string;
  imageUrl: string;
  name: string;
  snippet: string;
  isSelected: boolean;
}

export interface CustomisedPhone {
  [key: string]: any;
  age: CustomisedPhonePropertyType;
  id: CustomisedPhonePropertyType;
  imageUrl: CustomisedPhonePropertyType;
  name: CustomisedPhonePropertyType;
  snippet: CustomisedPhonePropertyType;
  isSelected: CustomisedPhonePropertyType;
}

export interface CustomisedPhonePropertyType {
  value: any;
  isEdited: boolean;
}

export interface PhoneFromServer {
  [key: string]: any;
  age: number;
  id: string;
  imageUrl: string;
  name: string;
  snippet: string;
}

export interface ColumnConfig {
  title: string;
  sortType?: string;
  isSearchable: boolean;
  sortDirection?: string;
}

export interface ColumnsConfig {
  [key: string]: ColumnConfig;
  age: ColumnConfig;
  id: ColumnConfig;
  imageUrl: ColumnConfig;
  name: ColumnConfig;
  snippet: ColumnConfig;
}

export interface FilterPropsType {
  columnsConfig: ColumnsConfig;
  handleFilterChange: (fieldValue:string, selectValue:string) => void;
}

export interface DatatablePropsType {
  phones: Phone[];
  columnsConfig: ColumnsConfig;
  onSelectionChanged: () => void;
  handleColumnHeadClick: (head: string) => void;
  isAllSelected: boolean;
  handleIsAllSelectedClick: () => void;
  handleRowClick: (phoneId: string) => void;
  initialPhones: Phone[];
  setInitialPhones: (phones:Phone[]) => void;
}

export interface PaginationPropsType {
total: number;
perPage: number;
page: number;
setTotal: (totalLength:number) => void;
setPerPage: (perPage:number) => void;
setPage: (page:number) => void;
}

export interface TitlePaginationPropsType {
  from: number;
  to: number;
  total: number;
}

export interface TableRowType {
  phone: Phone;
  handleRowClick: (phoneId: string) => void;
  onSelectionChanged: () => void;
  heads: string[];
  initialPhones: Phone[];
  setInitialPhones: (phones:Phone[]) => void
}

export interface TableCellPropsType {
  phoneId: string;
  head: string;
  value: string;
  initialPhones: Phone[];
  setInitialPhones: (phones:Phone[]) => void
}

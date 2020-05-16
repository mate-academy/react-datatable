/// <reference types="react-scripts" />

interface PhoneFromServer {
  age: number,
  carrier: string,
  id: string,
  imageUrl: string,
  name: string,
  snippet: string,
}

interface Phone {
  [key: string]: any,
  id: string,
  name: string,
  age: number,
  snippet: string,
  selected: boolean,
}

type ColumnConfig = {
  [key: string]: SortField,
  name: SortField,
  age: SortField,
  snippet: SortField,
}

type SortField = {
  [key: string]: string | boolean | Validator[],
  title: string,
  sortType?: string,
  isSearchable?: boolean,
  validators: Validator[],
}

type Validator = (name: string, value: string) => string;

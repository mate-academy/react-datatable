/// <reference types="react-scripts" />

interface Phone {
  [key: string]: string | number | boolean
  age: number;
  carrier: string;
  id: string;
  imageUrl: string;
  name: string;
  snippet: string;
  checked: boolean;
}

interface Checked {
  title: string,
}

interface Name {
  title: string,
  sortType: string,
  isSearchable: boolean,
}

interface Age {
  title: string,
  sortType: string,
}

interface Snippet {
  title: string,
  isSearchable: boolean,
}


interface ColumnConf {
  checked: Checked;
  name: Name;
  age: Age;
  snippet: Snippet;
}

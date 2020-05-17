import React from 'react';
import { THead } from './THead';
import { TBody } from './TBody';

type Props = {
  phones: Phone[];
  allPhones: Phone[];
  columnConfig: ColumnConfig;
  isSelectedAll: boolean;
  sortField: string;
  sortReverse: boolean;
  onSelectionChanged?: (id: string | null) => void;
  onSort: (name: string, field: SortField) => void;
  setPhones: (phones: Phone[]) => void;
}

export const DataTable: React.FC<Props> = ({
  phones,
  allPhones,
  columnConfig,
  isSelectedAll,
  sortField,
  sortReverse,
  onSelectionChanged,
  onSort,
  setPhones,
}) => {
  return (
    <table className="table is-bordered is-striped is-fullwidth">
      <THead
        columnConfig={columnConfig}
        isSelectedAll={isSelectedAll}
        sortField={sortField}
        sortReverse={sortReverse}
        onSelectionChanged={onSelectionChanged}
        onSort={onSort}
      />
      <TBody
        phones={phones}
        allPhones={allPhones}
        columnConfig={columnConfig}
        onSelectionChanged={onSelectionChanged}
        setPhones={setPhones}
      />
    </table>
  );
}

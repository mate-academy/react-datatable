
import React from 'react';
import { DatatablePropsType, Phone } from './interfaces';
import { TableRow } from './TableRow';

export const Datatable = (props: DatatablePropsType) => {
  const {
    phones,
    initialPhones,
    columnsConfig,
    onSelectionChanged,
    handleColumnHeadClick,
    isAllSelected,
    handleIsAllSelectedClick,
    handleRowClick,
    setInitialPhones,
  } = props;


  const heads = Object.keys(columnsConfig);


  return (
    <table className="table">
      <thead className="thead">
        <tr>
          {typeof onSelectionChanged === 'function' ?
            <th><input
              type='checkbox'
              checked={isAllSelected}
              onChange={() => {}}
              onClick={handleIsAllSelectedClick}
            ></input></th> : ''}
          {heads.map((head: string) => (
            <th
              key={`headOf${head}`}
              onClick={() => { handleColumnHeadClick(head) }}
            >{`${columnsConfig[head].title}   ${columnsConfig[head].sortDirection || ''}`}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {phones.map((phone: Phone) => {
          return (
            <TableRow
              key={phone.id}
              initialPhones={initialPhones}
              phone={phone}
              handleRowClick={handleRowClick}
              onSelectionChanged={onSelectionChanged}
              heads={heads}
              setInitialPhones={setInitialPhones}
            />
          )

        })}
      </tbody>
    </table>
  )
}


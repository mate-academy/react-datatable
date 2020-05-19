
import React, { useState } from 'react';
import { FilterPropsType } from './interfaces';

export const Filter = ({ columnsConfig, handleFilterChange }: FilterPropsType) => {
  const [filterFieldValue, setFilterFieldValue] = useState('');
  const [selectValue, setSelectValue] = useState<string>(Object.keys(columnsConfig).find(
    column => columnsConfig[column].isSearchable
  ) || '');

  return (
    <>
      <input
        type="text"
        placeholder="Enter seaching text here..."
        onChange={(event) => {
          setFilterFieldValue(event.target.value);
          handleFilterChange(event.target.value, selectValue)
        }}
      >
      </input>
      <select
        value={selectValue}
        onChange={(event) => {
          setSelectValue(event.target.value)
          handleFilterChange(filterFieldValue, event.target.value)
        }}
      >
        <option></option>
        {Object.keys(columnsConfig)
          .map(column => {
             if (columnsConfig[column].isSearchable) {
              return (
                <option
                key={column}
                >
                  {column}
                </option>
              )
            }
            return '';
          })
        }
      </select>
    </>
  )
}


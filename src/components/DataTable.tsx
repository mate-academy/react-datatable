import React from 'react';
import { THead } from './THead';

interface Props {
  columnConfig: ColumnConf;
  items: Phone[];
  selected: boolean;
  changeStatus: (id: string) => void;
  selectAllPhones: () => void;
  sortPhonesBy: (sortParam: string, sortTitle: string) => void;
}

export const DataTable: React.FC<Props> = ({ columnConfig, items,
  selected, changeStatus, selectAllPhones, sortPhonesBy }) => (
  <table className="table table-dark">
      <THead
      columnConfig={columnConfig}
      selected={selected}
      selectAllPhones={selectAllPhones}
      sortPhonesBy={sortPhonesBy}
    />
      <tbody>
      {items.map((phone: Phone) => (
          <tr key={phone.id}>
          <th scope="row">
              <input
              type="checkbox"
              className="custom-checkbox"
              checked={phone.checked}
              onChange={() => changeStatus(phone.id)}
              id={`${phone.id}`}
            />
              <label htmlFor={`${phone.id}`} />
            </th>
          <td>{phone.name}</td>
          <td>{phone.age}</td>
          <td>{phone.snippet}</td>
        </tr>
      ))}

    </tbody>
    </table>
);

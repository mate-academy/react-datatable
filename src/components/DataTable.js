import React from 'react';
import PropTypes, { objectOf, shape } from 'prop-types';
import { THead } from './THead';

export const DataTable = ({ columnConfig, items,
  selected, changeStatus, selectAllPhones, sortPhonesBy }) => {


  return (
    <table className="table table-dark">
      <THead
        columnConfig={columnConfig}
        selected={selected}
        selectAllPhones={selectAllPhones}
        sortPhonesBy={sortPhonesBy}
      />
      <tbody>
        {items.map(phone => (
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
};

DataTable.propTypes = {
  perPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  changeStatus: PropTypes.func.isRequired,
  selectAllPhones: PropTypes.func.isRequired,
  sortPhonesBy: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(objectOf(shape({
    age: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    snippet: PropTypes.string.isRequired,
  }))).isRequired,
};

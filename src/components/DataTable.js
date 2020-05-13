import React from 'react';
import { THead } from './THead';

class DataTable extends React.PureComponent {

  render() {
    const {
      columnConfig, perPage, currentPage, items,
      selected, changeStatus, selectAllPhones, sortPhonesBy,
    } = this.props;
    const visiblePhones = items
      .slice((currentPage - 1) * perPage, perPage * currentPage);

    return (
      <table className="table table-dark">
        <THead
          columnConfig={columnConfig}
          selected={selected}
          selectAllPhones={selectAllPhones}
          sortPhonesBy={sortPhonesBy}
        />
        <tbody>
          {visiblePhones.map(phone => (
            <tr key={phone.id}>
              <th scope="row">
                <input
                  type="checkbox"
                  checked={phone.checked}
                  onChange={() => changeStatus(phone.id)}
                />
              </th>
              <td>{phone.name}</td>
              <td>{phone.age}</td>
              <td>{phone.snippet}</td>
            </tr>
          ))}

        </tbody>
      </table>
    );
  }
}

export default DataTable;

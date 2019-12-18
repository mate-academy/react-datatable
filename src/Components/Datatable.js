import React from 'react';
import PropsTypes from 'prop-types';

const Datatable = ({ items, columnConfig, sortPhones, tabs }) => {
  const start = tabs.perPage * tabs.page - (tabs.perPage - 1);
  const end = tabs.perPage * tabs.page >= items.length
    ? items.length
    : tabs.perPage * tabs.page;

  const showItems = items.filter((item, index) => (
    index + 1 >= start && index + 1 <= end
  ));

  const handleSort = (column) => {
    showItems.sort((a, b) => {
      switch (typeof a[column]) {
        case 'string':
          return a[column].localeCompare(b[column]);
        case 'number':
          return a[column] - b[column];
        default:
          return 0;
      }
    });

    if (showItems[0].id === items[start - 1].id) {
      showItems.reverse();
    }

    items.splice(start - 1, showItems.length, ...showItems);
    sortPhones(items);
  };

  return (
    <table className="data-table">
      <thead>
        <tr>
          {Object.keys(columnConfig).map(column => (
            <th
              key={columnConfig[column].title}
              onClick={() => handleSort(column)}
            >
              {columnConfig[column].title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {showItems.map(item => (
          <tr key={item.id}>
            {Object.keys(columnConfig).map(column => (
              <td key={item[column]}>
                {item[column]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

Datatable.propTypes = {
  items: PropsTypes.arrayOf.isRequired,
  columnConfig: PropsTypes.objectOf.isRequired,
  sortPhones: PropsTypes.func.isRequired,
  tabs: PropsTypes.objectOf.isRequired,
};

export default Datatable;

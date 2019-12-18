import React from 'react';
import PropsTypes from 'prop-types';
import Search from './Search';

const Header = ({ items,
  showItems,
  handleShowItems,
  searchPhones,
  columnConfig }) => {
  const entries = [5, 10, 15, 20];

  return (
    <header className="table__header">
      <div>
        Show
        <select
          name="entries"
          onChange={event => handleShowItems(event.target.value)}
          className="header__select"
        >
          {entries.map(n => (
            <option
              key={n}
              vlalue={n}
              defaultValue={n === showItems}
            >
              {n}
            </option>
          ))}
        </select>
        entries
      </div>
      <Search
        items={items}
        searchPhones={searchPhones}
        columnConfig={columnConfig}
      />
    </header>
  );
};

Header.propTypes = {
  items: PropsTypes.arrayOf.isRequired,
  showItems: PropsTypes.number.isRequired,
  handleShowItems: PropsTypes.func.isRequired,
  searchPhones: PropsTypes.func.isRequired,
  columnConfig: PropsTypes.objectOf.isRequired,
};

export default Header;

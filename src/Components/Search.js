import React from 'react';
import PropsTypes from 'prop-types';

const Search = ({ items, searchPhones, columnConfig }) => {
  const searchItems = (event) => {
    const value = event.target.value.toLowerCase();

    const searchColumn = Object.keys(columnConfig).filter(column => (
      columnConfig[column].isSearchable
    ));

    const result = items.filter((item) => {
      const searchArr = searchColumn.map(column => (
        item[column]
      ));

      return searchArr.join('').toLowerCase().includes(value);
    });

    searchPhones(result);
  };

  return (
    <div className="header__search">
      <label htmlFor="search">
        Search:
        <input
          id="search"
          type="search"
          onChange={searchItems}
          autoComplete="off"
          className="header__input"
        />
      </label>
    </div>
  );
};

Search.propTypes = {
  items: PropsTypes.arrayOf.isRequired,
  searchPhones: PropsTypes.func.isRequired,
  columnConfig: PropsTypes.objectOf.isRequired,
};

export default Search;

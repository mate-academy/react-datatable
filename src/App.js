import React, { useState, useEffect, useCallback } from 'react';
import './app.css';

import { DataTable } from './components/DataTable';
import { getPhones } from './helper/getData';
import { Select } from './components/select';
import { Buttons } from './components/Buttons';
import { debounce } from './helper/debounce';
import { filterPhones } from './helper/filterPhones';
import { switchTitle } from './helper/switchTitle';
import { columnConfig } from './helper/columnConfig';

export const App = () => {
  const [phones, setPhones] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [perPage, setPerPageValue] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectAll, setSelectAllStatus] = useState(false);
  const [sortedMethod, setSortedMethod] = useState('age');

  useEffect(() => {
    getPhones()
      .then((phones) => {
        setPhones(phones);
      });

  }, []);

  useEffect(() => {
    const filter = filterPhones(columnConfig, phones, searchValue);

    if (filter.length) {
      isCheckedAll(filter);
    } else {
      isCheckedAll();
    }
  }, [phones]);

  useEffect(() => {
    let filter = phones;

    if (searchValue) {
      filter = filterPhones(columnConfig, phones, searchValue);
    }

    isCheckedAll(filter);
  }, [searchValue]);

  const debounceWrapper = useCallback(
    debounce(value => setSearchAndPageValue(value), 1000),
    []
  );

  const setSearchAndPageValue = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const changeSelectPage = (e) => {
    const newValue = e.target.value;

    setPerPageValue(newValue);
    setCurrentPage(1);
  };

  const changeStatus = (id) => {
    const preparedPhones = phones.map(phone => ({
      ...phone,
      checked: id === phone.id
        ? !phone.checked
        : phone.checked,
    }));

    setPhones(preparedPhones);
  };

  const startDebounce = (e) => {
    const { value } = e.target;

    debounceWrapper(value);
  };

  const selectPage = (e, page) => {
    e.preventDefault();
    setCurrentPage(page);
  };

  const nearbyPage = (e, path) => {
    e.preventDefault();

    let filteredPhones = phones;

    if (searchValue) {
      filteredPhones = filterPhones(columnConfig, phones, searchValue);
    }

    if ((currentPage + path > Math.ceil(filteredPhones.length / perPage))
      || (currentPage + path === 0)) {
      return;
    }

    setCurrentPage(currentPage + path);
  };

  const isCheckedAll = (sortedPhones = false) => {
    let isSelected = phones.every(phone => phone.checked);
    if (!sortedPhones) {
      if (isSelected) {
        setSelectAllStatus(true);
      } else {
        setSelectAllStatus(false);
      }
    } else {
      isSelected = sortedPhones.every(phone => phone.checked);
      if (isSelected) {
        setSelectAllStatus(true);
      } else {
        setSelectAllStatus(false);
      }
    }
  };

  const selectAllPhones = () => {
    const filteredPhones = filterPhones(columnConfig, phones, searchValue);
    const selectFilteredPhones = phones
      .map(phone => ({
        ...phone,
        checked: filteredPhones
          .some(filter => filter.id === phone.id)
          ? !selectAll
          : phone.checked,
      }));

    if (searchValue) {
      setPhones(selectFilteredPhones);
      setSelectAllStatus(!selectAll);
    } else {
      const preparedPhonesWithoutSearchValue = phones.map(phone => ({
        ...phone,
        checked: !selectAll,
      }));

      setPhones(preparedPhonesWithoutSearchValue);
      setSelectAllStatus(!selectAll);
    }
  };

  const sortPhonesBy = (sortParam, sortTitle) => {
    const sortBy = switchTitle(sortTitle);
    let sortedPhones = [];

    if (sortBy === sortedMethod) {
      sortedPhones = [...phones].reverse();
      setPhones(sortedPhones);

      return;
    }

    if (sortParam === 'string') {
      sortedPhones = [...phones]
        .sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
      setPhones(sortedPhones);
      setSortedMethod(sortBy);

      return;
    }

    if (sortParam === 'number') {
      sortedPhones = [...phones]
        .sort((a, b) => a[sortBy] - b[sortBy]);

      setPhones(sortedPhones);
      setSortedMethod(sortBy);
    }
  };

  const mathcedPhones = filterPhones(columnConfig, phones, searchValue)

  const slicedPhones = mathcedPhones
    .slice((currentPage - 1) * perPage, perPage * currentPage);

  return (
    <div className="App">
      <input
        type="text"
        className="form-control myInput"
        placeholder="Write for search"
        onChange={startDebounce}
      />
      {mathcedPhones.length > 0 ? (
        <>
          <h3
            className="myCount"
          >
            from
            {' '}
            {
              ((currentPage - 1) * perPage) + 1
            }
            {' '}
            to
            {' '}
            {
              (currentPage * perPage) > mathcedPhones.length
                ? mathcedPhones.length
                : currentPage * perPage
            }
            {' '}
            of
            {' '}
            {mathcedPhones.length}
          </h3>
          <DataTable
            items={slicedPhones}
            columnConfig={columnConfig}
            perPage={perPage}
            currentPage={currentPage}
            selected={selectAll}
            changeStatus={changeStatus}
            selectAllPhones={selectAllPhones}
            sortPhonesBy={sortPhonesBy}
          />
          <div className="myContainer">
            <Select
              perPage={perPage}
              changePage={changeSelectPage}
            />
            <Buttons
              perPage={perPage}
              items={mathcedPhones}
              page={currentPage}
              selectPage={selectPage}
              nearbyPage={nearbyPage}
            />
          </div>
        </>
      ) : (
          <p className="myErr">Nothing matched the search</p>
        )}

    </div>
  );
};

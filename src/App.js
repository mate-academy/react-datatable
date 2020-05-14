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
  const [items, setPhonesItems] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [perPage, setPerPageValue] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [visiblePhones, setVisiblePhones] = useState([]);
  const [selectAll, setSelectAllStatus] = useState(false);
  const [sortedMethod, setSortedMethod] = useState('age');
  let searchedPhones;

  useEffect(() => {
    getPhones()
      .then((phones) => {
        setPhonesItems(phones);
        setVisiblePhones(phones);
      });
  }, []);

  useEffect(() => {
    if (searchValue) {
      searchedPhones = filterPhones(columnConfig, items, searchValue);
      setVisiblePhones(searchedPhones);
    } else {
      searchedPhones = items;
      setVisiblePhones(searchedPhones);
    }
  }, [searchValue, items]);

  useEffect(() => {
    const filter = filterPhones(columnConfig, items, searchValue);

    if (filter.length) {
      isCheckedAll(filter);
    } else {
      isCheckedAll();
    }
  }, [items]);

  useEffect(() => {
    let filter = items;

    if (searchValue) {
      filter = filterPhones(columnConfig, items, searchValue);
    }

    isCheckedAll(filter);
  }, [searchValue]);

  const debounceWrapper = useCallback(
    debounce(value => setValue(value), 1000),
    []
  );

  const setValue = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const changeSelectPage = (e) => {
    const newValue = e.target.value;

    setPerPageValue(newValue);
    setCurrentPage(1);
  };

  const changeStatus = (id) => {
    const preparedPhones = items.map(phone => ({
      ...phone,
      checked: id === phone.id
        ? !phone.checked
        : phone.checked,
    }));

    setPhonesItems(preparedPhones);
  };

  const startDebounce = (e) => {
    const { value } = e.target;

    setInputValue(value);
    debounceWrapper(value);
  };

  const selectPage = (e, page) => {
    e.preventDefault();
    setCurrentPage(page);
  };

  const nearbyPage = (e, path) => {
    e.preventDefault();

    let filteredPhones = items;

    if (searchValue) {
      filteredPhones = filterPhones(columnConfig, items, searchValue);
    }

    if ((currentPage + path > Math.ceil(filteredPhones.length / perPage))
      || (currentPage + path === 0)) {
      return;
    }

    setCurrentPage(currentPage + path);
  };

  const isCheckedAll = (phones = false) => {
    let isSelected = items.every(phone => phone.checked);

    if (!phones) {
      if (isSelected) {
        setSelectAllStatus(true);
      } else {
        setSelectAllStatus(false);
      }
    } else {
      isSelected = phones.every(phone => phone.checked);

      if (isSelected) {
        setSelectAllStatus(true);
      } else {
        setSelectAllStatus(false);
      }
    }
  };

  const selectAllPhones = () => {
    const filteredPhones = filterPhones(columnConfig, items, searchValue);
    const selectFilteredPhones = items
      .map(phone => ({
        ...phone,
        checked: filteredPhones
          .some(filter => filter.id === phone.id)
          ? !selectAll
          : phone.checked,
      }));

    if (searchValue) {
      setPhonesItems(selectFilteredPhones);
      setSelectAllStatus(!selectAll);
    } else {
      const preparedPhonesWithoutSearchValue = items.map(phone => ({
        ...phone,
        checked: !selectAll,
      }));

      setPhonesItems(preparedPhonesWithoutSearchValue);
      setSelectAllStatus(!selectAll);
    }
  };

  const sortPhonesBy = (sortParam, sortTitle) => {
    const sortBy = switchTitle(sortTitle);
    let sortedPhones = [];

    if (sortBy === sortedMethod) {
      sortedPhones = [...items].reverse();
      setPhonesItems(sortedPhones);

      return;
    }

    if (sortParam === 'string') {
      sortedPhones = [...items]
        .sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
      setPhonesItems(sortedPhones);
      setSortedMethod(sortBy);

      return;
    }

    if (sortParam === 'number') {
      sortedPhones = [...items]
        .sort((a, b) => a[sortBy] - b[sortBy]);

      setPhonesItems(sortedPhones);
      setSortedMethod(sortBy);
    }
  };

  return (
    <div className="App">
      <input
        type="text"
        className="form-control myInput"
        placeholder="Write for search"
        value={inputValue}
        onChange={startDebounce}
      />
      {visiblePhones.length ? (
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
              (currentPage * perPage) > visiblePhones.length
                ? visiblePhones.length
                : currentPage * perPage
            }
            {' '}
            of
            {' '}
            {visiblePhones.length}
          </h3>
          <DataTable
            items={visiblePhones}
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
              items={visiblePhones}
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

import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import './app.css';

import { DataTable } from './components/DataTable';
import { getPhones } from './helper/getData';
import { Select } from "./components/Select";
import { Buttons } from './components/Buttons';
import { debounce } from './helper/debounce';
import { filterPhones } from './helper/filterPhones';
import { switchTitle } from './helper/switchTitle';
import { columnConfig } from './helper/columnConfig';

export const App = () => {
  const [phones, setPhones] = useState<Phone[]>([]);
  const [query, setQuery] = useState('');
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
    const filter = filterPhones(columnConfig, phones, query);

    if (filter.length) {
      isCheckedAll(filter);
    } else {
      isCheckedAll([]);
    }
  }, [phones]);

  useEffect(() => {
    let filter: Phone[] = phones;

    if (query) {
      filter = filterPhones(columnConfig, phones, query);
    }

    isCheckedAll(filter);
  }, [query]);

  const debounceWrapper = useCallback(
    debounce((value: string) => setSearchAndPageValue(value), 1000),
    []
  );

  const setSearchAndPageValue = (value: string) => {
    setQuery(value);
    setCurrentPage(1);
  };

  const changeSelectPage = (e: ChangeEvent<HTMLSelectElement>) => {
    const newValue: number = +e.target.value;

    setPerPageValue(newValue);
    setCurrentPage(1);
  };

  const changeStatus = (id: string) => {
    const preparedPhones: Phone[] = phones.map(phone => ({
      ...phone,
      checked: id === phone.id
        ? !phone.checked
        : phone.checked,
    }));

    setPhones(preparedPhones);
  };

  const startDebounce = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    debounceWrapper(value);
  };

  const selectPage = (e: React.MouseEvent, page: number) => {
    e.preventDefault();
    setCurrentPage(page);
  };

  const nearbyPage = (e: React.MouseEvent, path: number) => {
    e.preventDefault();

    let filteredPhones = phones;

    if (query) {
      filteredPhones = filterPhones(columnConfig, phones, query);
    }

    if ((currentPage + path > Math.ceil(filteredPhones.length / perPage))
      || (currentPage + path === 0)) {
      return;
    }

    setCurrentPage(currentPage + path);
  };

  const isCheckedAll = (sortedPhones: Phone[]) => {
    let isSelected = phones.every(phone => phone.checked);
    if (!sortedPhones.length) {
      if (isSelected) {
        setSelectAllStatus(true);
      } else {
        setSelectAllStatus(false);
      }
    } else {
      isSelected = sortedPhones.every((phone: Phone) => phone.checked);
      if (isSelected) {
        setSelectAllStatus(true);
      } else {
        setSelectAllStatus(false);
      }
    }
  };

  const selectAllPhones = () => {
    const filteredPhones = filterPhones(columnConfig, phones, query);
    const selectFilteredPhones = phones
      .map(phone => ({
        ...phone,
        checked: filteredPhones
          .some((filter: Phone) => filter.id === phone.id)
          ? !selectAll
          : phone.checked,
      }));

    if (query) {
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

  const sortPhonesBy = (sortParam: string, sortTitle: string) => {
    const sortBy = switchTitle(sortTitle);
    let sortedPhones = [];

    if (sortBy === sortedMethod) {
      sortedPhones = [...phones].reverse();
      setPhones(sortedPhones);

      return;
    }

    if (sortParam === 'string') {
      sortedPhones = [...phones]
        .sort((a: Phone, b: Phone): number => {
          const comperator1 = a[sortBy];
          const comperator2 = b[sortBy];

          if (typeof comperator1 === 'string') {
            return comperator1.localeCompare(comperator2 as string)
          }

          return 0
        });

      setPhones(sortedPhones);
      setSortedMethod(sortBy);

      return;
    }

    if (sortParam === 'number') {
      sortedPhones = [...phones]
        .sort((a: Phone, b: Phone): number => {
          const comperator1 = a[sortBy];
          const comperator2 = b[sortBy];

          if (typeof comperator1 === 'number') {
            return comperator1 - (comperator2 as number)
          }

          return 0
        });

      setPhones(sortedPhones);
      setSortedMethod(sortBy);
    }
  };

  const editCell = (id: string, value: string, configParam: string) => {
    const newValues = phones.map(phone => ({
      ...phone,
      [configParam]: id === phone.id
        ? value
        : phone[configParam]
    })).map(phone => ({
      ...phone,
      age: +phone.age,
    }))

    setPhones(newValues);
    setSortedMethod('');
  }

  const mathcedPhones = filterPhones(columnConfig, phones, query)

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
            selected={selectAll}
            changeStatus={changeStatus}
            selectAllPhones={selectAllPhones}
            sortPhonesBy={sortPhonesBy}
            editCell={editCell}
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

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './App.css';

import { getPhones, required, minLength, dataType } from './helpers';
import { DataTable } from './components/DataTable';
import { Columns, SortTypes } from './components/Emuns';
import { Search } from './components/Search';
import { Pagination } from "./components/Pagination";

const columnConfig: ColumnConfig = {
  [Columns.Name]: {
    title: 'Название',
    sortType: SortTypes.String,
    isSearchable: true,
    validators: [required, minLength(5)],
  },
  [Columns.Age]: {
    title: 'Возраст',
    sortType: SortTypes.Number,
    validators: [required, dataType('number')],
  },
  [Columns.Snippet]: {
    title: 'Описание',
    isSearchable: true,
    validators: [required, minLength(10)],
  }
};

function App() {
  const [phones, setPhones] = useState<Phone[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [sortField, setSortField] = useState(Columns.Name);
  const [sortType, setSortType] = useState(columnConfig[Columns.Name].sortType);
  const [sortReverse, setSortReverse] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  const [actualPage, setActualPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const firstVisibleIndex = ((actualPage - 1) * perPage) + 1;

  useEffect(() => {
    loadPhones();
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(phones.length / perPage));
  }, [phones.length, perPage]);

  useEffect(() => {
    setActualPage(1);
  }, [perPage]);

  useEffect(() => {
    setActualPage(1);
  }, [filterQuery])

  const loadPhones = async () => {
    try {
      const phonesFromServer = await getPhones();
      const preparedPhones = phonesFromServer.map((phone: PhoneFromServer) => {
        const preparedPhone: Phone = {
          id: phone.id,
          [Columns.Name]: phone.name,
          [Columns.Age]: phone.age,
          [Columns.Snippet]: phone.snippet,
          selected: false,
        };

        return preparedPhone;
      })
      setPhones(preparedPhones);
      setTotalPages(Math.ceil(preparedPhones.length / perPage));
    } catch {
      setErrorMessage('Oops! Something went wrong... :(');
    }
  }

  const onSelectionChanged = (id: string | null) => {
    if (id) {
      setPhones(phones.map(phone => (phone.id === id)
        ? {...phone, selected: !phone.selected}
        : phone
      ));

      return;
    }

    setPhones(
      phones.map(phone => (
        (filteredPhones.includes(phone))
          ? {...phone, selected: !isSelectedAll}
          : phone
      )
    ));
  }

  const onSort = (key: string, field: SortField) => {
    if (!field.sortType) {
      return;
    }

    (key === sortField) ? setSortReverse(!sortReverse) : setSortReverse(false);

    setSortField(key as Columns);
    setSortType(field.sortType as SortTypes);
  }

  const changeActualPage = (newPage: number) => {
    if (
      newPage === actualPage
      || newPage < 1
      || newPage > Math.ceil(sortedPhones.length / perPage)
    ) {
      return;
    }

    setActualPage(newPage);
  }

  const filterPhones = useCallback(
    ((phones: Phone[], query: string) => {
      const pattern = new RegExp(filterQuery.trim(), 'i');

      return phones.filter(phone => {
        let searchArea = '';

        Object.keys(phone).forEach((prop) => {
           if (columnConfig[prop] && columnConfig[prop].hasOwnProperty('isSearchable')) {
            searchArea += ` ${phone[prop]}`
          }
        });

        return searchArea.match(pattern);
      });
    }),
    [filterQuery],
  )

  const sortPhones = useCallback(
    (phones: Phone[], sortType: string | undefined, sortReverse: boolean) => {
      const sortedPhones = [...phones];

      if (sortType === SortTypes.String) {
        sortedPhones.sort((a, b) => (a[sortField] as string).localeCompare(b[sortField] as string));
     }

      if (sortType === SortTypes.Number) {
        sortedPhones.sort((a, b) => (a[sortField] as number) - (b[sortField] as number));
      }

      return (sortReverse) ? sortedPhones.reverse() : sortedPhones;
    },
    [sortField],
  );

  const filteredPhones = useMemo(
    () => filterPhones(phones, filterQuery),
    [filterPhones, phones, filterQuery],
  );
  const sortedPhones = useMemo(
    () => sortPhones(filteredPhones, sortType, sortReverse),
    [sortPhones, filteredPhones, sortType, sortReverse],
  );
  const paginatedPhones = sortedPhones.slice(firstVisibleIndex - 1, firstVisibleIndex + perPage - 1);

  useEffect(() => {
    setIsSelectedAll(filteredPhones.length > 0 && filteredPhones.every(phone => phone.selected));
  }, [filteredPhones, phones, filterQuery])

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">
          React Datatable
        </h1>
        {errorMessage && (
          <div className="message is-danger">
            <div className="message-header">
              Error
            </div>
            <div className="message-body">
              {errorMessage}
            </div>
          </div>
        )}
        {!errorMessage && (
          <>
            {sortedPhones.length > perPage && (
              <h2 className="subtitle">
                {`Phones from ${firstVisibleIndex} to ${firstVisibleIndex + perPage - 1}`}
              </h2>
            )}

            <Search
              filterQuery={filterQuery}
              setFilterQuery={setFilterQuery}
            />
            <DataTable
              phones={paginatedPhones}
              allPhones={phones}
              columnConfig={columnConfig}
              isSelectedAll={isSelectedAll}
              sortReverse={sortReverse}
              sortField={sortField}
              onSelectionChanged={onSelectionChanged}
              onSort={onSort}
              setPhones={setPhones}
            />
            <Pagination
              total={sortedPhones.length}
              perPage={perPage}
              page={actualPage}
              changeActualPage={changeActualPage}
              setPerPage={setPerPage}
            />
          </>
        )}
      </div>
    </section>
  );
}

export default App;

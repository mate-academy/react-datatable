import React, { useState, useEffect } from 'react';
import { Datatable } from './Datatable';
import { getPhonesFromServer } from './api';
import { ColumnsConfig, Phone, PhoneFromServer } from './interfaces';
import { Filter } from './Filter';
import { Pagination } from './Pagination';
import { TitlePagination } from './TitlePagination';




const App = () => {
  const [onPagePhones, setOnPagePhones] = useState<Phone[]>([])
  const [totalLength, setTotalLength] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(5);
  const [activePageNumber, setActivePageNumber] = useState<number>(1);
  const [isAllSelected, setIsAllSelected] = useState(false)
  const [phones, setPhones] = useState<Phone[]>([]);
  const [filteredPhones, setFilteredPhones] = useState<Phone[]>([]);
  const [seachingText, setSeachingText] = useState('')
  const [columnName, setColumnName] = useState('')
  const [columnsConfig, setColumnsConfig] = useState<ColumnsConfig>({
    age: {
      title: 'Age',
      sortType: 'number',
      isSearchable: true,
      sortDirection: '↕',
    },
    id: {
      title: 'Id',
      sortType: 'string',
      isSearchable: true,
      sortDirection: '↕',
    },
    imageUrl: {
      title: 'imageUrl',
      isSearchable: true,
    },
    name: {
      title: 'Name',
      sortType: 'string',
      isSearchable: true,
      sortDirection: '↕',
    },
    snippet: {
      title: 'Snippet',
      sortType: 'string',
      isSearchable: true,
      sortDirection: '↕',
    }
  });

  window.onbeforeunload = function() {
    return false;
  };

  useEffect(() => {
    if (columnName === '' || seachingText === '') {
      setFilteredPhones(phones);
      return;
    }
    setFilteredPhones(phones.filter(phone => (
      (phone[columnName])
        .toString(10)
        .toLowerCase()
        .includes(seachingText.toLowerCase()))))
  }, [phones, columnName, seachingText])

  useEffect(() => {
    let start = (activePageNumber - 1) * perPage;
    let end = start + perPage;
    setOnPagePhones(filteredPhones.slice(start, end))
  }, [totalLength, perPage, activePageNumber, filteredPhones])



  useEffect(() => {
    if (localStorage.getItem('phones')) {
      setPhones(JSON.parse(localStorage.getItem('phones') || ''))
    } else {
      getPhonesFromServer().then((phonesFromServer: PhoneFromServer) => {
        setPhones(phonesFromServer.map((phone: PhoneFromServer) => ({
          ...phone,
          isSelected: false,
        })))
      })
    }
  }, [])

  useEffect(() => {
    setTotalLength(filteredPhones.length);
    let start = (activePageNumber - 1) * perPage;
    let end = start + perPage;
    setOnPagePhones(filteredPhones.slice(start, end))
  }, [filteredPhones, activePageNumber, perPage])


  const setSortDirectionsToDefault = () => {
    for (let i in columnsConfig) {
      if (columnsConfig[i].sortDirection === '↟'
        || columnsConfig[i].sortDirection === '↡')
        columnsConfig[i].sortDirection = '↕';
    }
  }

  const handleColumnHeadClick: (head: string) => void = (head: string) => {
    if (columnsConfig[head].sortDirection === '↕'
      || columnsConfig[head].sortDirection === '↡') {
      switch (columnsConfig[head].sortType) {
        case undefined:
          break;
        case 'string':
          setPhones([...phones].sort((a, b) => (a[head].localeCompare(b[head]))));
          break;
        case 'number':
          setPhones([...phones].sort((a, b) => (a[head] - (b[head]))));
          break;
        default:
          break;
      };
      setSortDirectionsToDefault();
      columnsConfig[head].sortDirection = '↟';
      setColumnsConfig({ ...columnsConfig })
      console.log(phones)
      return;
    }

    if (columnsConfig[head].sortDirection === '↟') {
      switch (columnsConfig[head].sortType) {
        case undefined:
          break;
        case 'string':
          setPhones([...phones].sort((a, b) => (b[head].localeCompare(a[head]))));
          break;
        case 'number':
          setPhones([...phones].sort((a, b) => (b[head] - (a[head]))));
          break;
        default:
          break;
      };
      setSortDirectionsToDefault();
      columnsConfig[head].sortDirection = '↡';
      setColumnsConfig({ ...columnsConfig })
      console.log(phones)
      return;
    }
  }

  const handleIsAllSelectedClick = () => {
    setIsAllSelected(!isAllSelected);
    setPhones(phones.map((phone) => {
      phone.isSelected = !isAllSelected;
      return phone;
    }))

  }



  const handleRowClick = (phoneId: string) => {
    let isAll = true;
    setPhones(phones.map(phone => {
      if (phone.id === phoneId) {
        phone.isSelected = !phone.isSelected;
      };

      if (phone.isSelected === false) {
        isAll = false;
      }
      return phone;
    }));
    setIsAllSelected(isAll);
  }

  const handleFilterChange = (newSeachingText: string, newColumnName: string) => {
    console.log(seachingText, columnName)
    if (newColumnName === '' || newSeachingText === '') {
      setFilteredPhones(phones);
      setColumnName(newColumnName);
      setSeachingText(newSeachingText);
      return;
    }
    setColumnName(newColumnName);
    setSeachingText(newSeachingText);
    setFilteredPhones(phones.filter(phone => (
      (phone[newColumnName])
        .toString(10)
        .toLowerCase()
        .includes(newSeachingText.toLowerCase()))))
  }

  return (
    <>
      <Filter
        columnsConfig={columnsConfig}
        handleFilterChange={handleFilterChange}
      />
      <TitlePagination
        from={(activePageNumber - 1) * perPage}
        to={(activePageNumber - 1) * perPage + perPage}
        total={totalLength}
      />

      <Datatable
        phones={onPagePhones}
        initialPhones={phones}
        setInitialPhones={setPhones}
        columnsConfig={columnsConfig}

        onSelectionChanged={() => { }}
        handleColumnHeadClick={handleColumnHeadClick}
        isAllSelected={isAllSelected}

        handleIsAllSelectedClick={handleIsAllSelectedClick}
        handleRowClick={handleRowClick}
      />

      <Pagination

        total={totalLength}
        setTotal={setTotalLength}
        perPage={perPage}
        setPerPage={setPerPage}
        page={activePageNumber}
        setPage={setActivePageNumber}
      />
    </>
  );
}

export default App;

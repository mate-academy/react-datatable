import React from 'react';
import './app.css';

import DataTable from './components/DataTable';
import { getPhones } from './helper/getData';
import { Select } from './components/select';
import { Buttons } from "./components/Buttons";

const columnConfig = {
  checked: {
    title: '❯'
  },
  name: {
    title: 'Название',
    sortType: 'string',
    isSearchable: true,
  },
  age: {
    title: 'Возраст',
    sortType: 'number',
  },
  snippet: {
    title: 'Описание',
    isSearchable: true,
  }
};

class App extends React.Component {
  state = {
    items: [],
    currentPage: 1,
    perPage: 5,
    selectAll: false,
    sortedMethod: 'age',
    searchValue: '',
    filterValue: '',
  }

  componentDidMount() {
    getPhones()
      .then(phones => this.setState({ items: phones }));
  }

  changeSelectPage = (e) => {
    const newValue = e.target.value;
    this.setState({
      perPage: newValue,
      currentPage: 1,
      searchValue: '',
      filterValue: '',
    }, () => this.isCheckedAll());
  }

  nearbyPage = (path) => {
    const { currentPage, items, perPage, filterValue } = this.state;
    let filteredPhones = items;

    if (filterValue) {
      filteredPhones = this.filterPhones();
    }

    if ((currentPage + path > Math.ceil(filteredPhones.length / perPage))
      || (currentPage + path === 0)) {
      console.log('in');
      return
    }

    this.setState(state => ({ currentPage: state.currentPage + path }))
  }

  selectPage = (page) => {
    this.setState({ currentPage: page });
  }

  changeStatus = (id) => {
    const { items } = this.state;
    const preparedPhones = items.map(phone => ({
      ...phone,
      checked: id === phone.id
        ? !phone.checked
        : phone.checked,
    }))

    this.setState({ items: preparedPhones },
      () => {
        const filter = this.filterPhones();

        if (filter.length) {
          this.isCheckedAll(filter)
        } else {
          this.isCheckedAll()
        }
      })
  }

  isCheckedAll = (phones = false) => {
    const { items } = this.state
    let isSelected = items.every(phone => phone.checked)
    if (!phones) {
      if (isSelected) {
        this.setState({ selectAll: true })
      } else {
        this.setState({ selectAll: false })
      }
    } else {
      isSelected = phones.every(phone => phone.checked)
      if (isSelected) {
        this.setState({ selectAll: true })
      } else {
        this.setState({ selectAll: false })
      }
    }

  }

  switchTitle = (param) => {
    switch (param) {
      case 'Название':
        return 'name';

      case 'Возраст':
        return 'age';

      case 'Описание':
        return 'snippet';
    }
  }

  selectAllPhones = () => {
    this.setState(state => ({
      items: state.items.map(phone => ({
        ...phone,
        checked: !state.selectAll
      })),
      selectAll: !state.selectAll
    }))
  }

  sortPhonesBy = (sortParam, sortTitle) => {
    const { sortedMethod, items } = this.state;
    let sortBy = this.switchTitle(sortTitle);
    let sortedPhones = [];

    if (sortBy === sortedMethod) {
      sortedPhones = [...items].reverse();
      this.setState({ items: sortedPhones })
      return;
    }

    if (sortParam === 'string') {
      sortedPhones = [...items]
        .sort((a, b) => a[sortBy].localeCompare(b[sortBy]))

      this.setState(() => ({
        items: sortedPhones,
        sortedMethod: sortBy,
      }))

      return;
    }

    if (sortParam === 'number') {
      sortedPhones = [...items]
        .sort((a, b) => a[sortBy] - b[sortBy]);

      this.setState(() => ({
        items: sortedPhones,
        sortedMethod: sortBy,
      }))

      return;
    }
  }

  handleInput = (e) => {
    this.setState({ searchValue: e.target.value.replace(/^ /, '') });
  }

  debounce = (f, delay) => {
    let timerID;

    const debounced = () => {
      clearTimeout(timerID);
      timerID = setTimeout(() => f(), delay);
    }

    return debounced;
  }

  filterPost = () => {
    const { searchValue } = this.state;

    this.setState({ filterValue: searchValue }, () => {
      const filteredList = this.filterPhones()
      this.isCheckedAll(filteredList)
    });
  }

  debounceWrapper = this.debounce(this.filterPost, 1000)

  filterPhones = () => {
    const { items, filterValue } = this.state;
    const valueForSearch = Object
      .values(columnConfig)
      .filter(config => config.isSearchable);
    const searchKey = [];
    const setFilteredPhones = new Set();

    valueForSearch
      .map(phone => phone.title)
      .forEach(key => searchKey
        .push(this.switchTitle(key)));


    searchKey.forEach(key => {
      items.forEach(phone => {
        if (phone[key]
          .toLocaleLowerCase()
          .includes(filterValue
            .toLocaleLowerCase())) {
          setFilteredPhones.add(phone)
        }
      })
    });
    const resultFilter = [...setFilteredPhones.values()]

    return resultFilter;
  }

  render() {
    const {
      perPage, items, currentPage, selectAll, searchValue, filterValue
    } = this.state;
    let searchedPhones = items;

    if (filterValue) {
      searchedPhones = this.filterPhones();
    }

    let visibleFrom = ((currentPage - 1) * perPage) + 1;
    let visibleTo = (currentPage * perPage) > searchedPhones.length
      ? searchedPhones.length
      : currentPage * perPage;

    return (
      <div className="App">
        <input
          type="text"
          className="form-control myInput"
          placeholder="Write for search"
          value={searchValue}
          onChange={(e) => {
            this.handleInput(e);
            this.debounceWrapper();
          }}
        />
        {searchedPhones.length ? (
          <>
            <h3
              className="myCount"
            >
              from {visibleFrom} to {visibleTo} of {searchedPhones.length}
            </h3>
            <DataTable
              items={searchedPhones}
              columnConfig={columnConfig}
              perPage={perPage}
              currentPage={currentPage}
              selected={selectAll}
              changeStatus={this.changeStatus}
              selectAllPhones={this.selectAllPhones}
              sortPhonesBy={this.sortPhonesBy}
            />
            <div className="myContainer">
              <Select
                perPage={perPage}
                changePage={this.changeSelectPage}
              />
              <Buttons
                perPage={perPage}
                items={searchedPhones}
                page={currentPage}
                selectPage={this.selectPage}
                nearbyPage={this.nearbyPage}
              />
            </div>
          </>
        ) : (
            <p className="myErr">Nothing matched the search</p>
          )}

      </div>
    );
  }
}

export default App;

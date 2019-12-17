import React from 'react';
import axios from 'axios';
import './App.css';
import Header from './Components/Header';
import Datatable from './Components/Datatable';
import Footer from './Components/Footer';

class App extends React.Component {
  phonesFromServer = [];

  state = {
    phones: [...this.phonesFromServer],
    tabs: {
      page: 1,
      perPage: 5,
    },
  }

  columnConfig = {
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
    },
  };

  handleUpdatePhones = phones => (
    this.setState({ phones })
  )

  handleShowItems = n => (
    this.setState(state => ({
      tabs: {
        page: state.tabs.page,
        perPage: n,
      },
    }))
  )

  handleTabs = page => (
    this.setState(state => ({
      tabs: {
        page,
        perPage: state.tabs.perPage,
      },
    }))
  )

  UNSAFE_componentWillMount() {
    const self = this;

    axios.get(
      'https://mate-academy.github.io/phone-catalogue-static/api/phones.json'
    )
      .then((result) => {
        this.phonesFromServer = result.data;
        self.setState({ phones: result.data });
      })
      .catch(() => {
        console.log('failed to get data');
      });
  }

  render() {
    const { phones, tabs } = this.state;

    return (
      <section className="app__table">
        <Header
          items={this.phonesFromServer}
          showItems={tabs.perPage}
          handleShowItems={this.handleShowItems}
          searchPhones={this.handleUpdatePhones}
          columnConfig={this.columnConfig}
        />
        <Datatable
          items={phones}
          tabs={tabs}
          columnConfig={this.columnConfig}
          onSelectionChanged={(selectedItems) => {}}
          sortPhones={this.handleUpdatePhones}
        />
        <Footer
          items={phones}
          tabs={tabs}
          handleTabs={this.handleTabs}
        />
      </section>
    );
  }
}

export default App;

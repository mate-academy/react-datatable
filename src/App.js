import React, { useState, useEffect } from 'react';
import './App.scss';
import { getPhonesFromServer } from './api/getPhonesFromServer';
import Datatable from './Components/Datatable';

const columnConfig = {
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

const App = () => {
  const [originalItems, setOriginalItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async() => {
      setIsError(false);
      setIsLoading(true);

      try {
        const phonesData = await getPhonesFromServer();

        setOriginalItems(phonesData);
      } catch (error) {
        setIsError(true);
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <h1 className="main-title">React Datatable</h1>

      {isError && <div className="message">Something went wrong ...</div>}

      {isLoading ? (
        <div className="message">Loading ...</div>
      ) : (
        <Datatable
          items={originalItems}
          columnConfig={columnConfig}
          onSelectionChanged={(selectedItems) => {}}
        />
      )}
    </div>
  );
};

export default App;

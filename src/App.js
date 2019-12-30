import React, { useState, useEffect } from 'react';
import './App.scss';
import { Button, Message } from 'semantic-ui-react';
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
const storedItems = JSON.parse(localStorage.getItem('originalItems'));

const App = () => {
  const [originalItems, setOriginalItems] = useState(storedItems || []);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async() => {
      setIsError(false);
      setIsLoading(true);

      try {
        const phonesData = await getPhonesFromServer();

        if (!storedItems) {
          setOriginalItems(phonesData);
        }
      } catch (error) {
        setIsError(true);
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const editItem = (itemToEdit) => {
    const editedItems = originalItems.map((item) => {
      if (item.id === itemToEdit.id) {
        const keys = Object.keys(columnConfig);

        if (keys.every(key => itemToEdit[key] === '')) {
          return 'empty';
        }

        return itemToEdit;
      }

      return item;
    });

    if (editedItems.includes('empty')) {
      editedItems.splice(editedItems.indexOf('empty'), 1);
    }

    setOriginalItems(editedItems);
  };

  const setDefaultItems = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="App">
      <div className="table-container">
        <h1 className="main-title">React Datatable</h1>

        {isError && <div className="message">Something went wrong ...</div>}

        {isLoading ? (
          <div className="message">Loading ...</div>
        ) : (
          <Datatable
            items={originalItems}
            columnConfig={columnConfig}
            onEdit={editItem}
          />
        )}
      </div>

      {storedItems && (
        <>
          <Message>
            <p>The data was restored from your local storage</p>
          </Message>

          <Button onClick={setDefaultItems}>
            Reset to default
          </Button>
        </>
      )}
    </div>
  );
};

export default App;

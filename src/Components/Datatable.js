import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import _ from 'lodash';
import { Table, Checkbox, Form } from 'semantic-ui-react';
import Header from './Header';
import Footer from './Footer';

const storedPage = JSON.parse(localStorage.getItem('page'));
const storedItemsPerPage = JSON.parse(localStorage.getItem('itemsPerPage'));
const storedSearchValue = JSON.parse(localStorage.getItem('searchValue'));
const storedHighlightedValue = JSON.parse(
  localStorage.getItem('highlightedValue')
);
const storedActiveColumn = JSON.parse(localStorage.getItem('activeColumn'));
const storedDirection = JSON.parse(localStorage.getItem('direction'));
const storedSortType = JSON.parse(localStorage.getItem('sortType'));
const storedSelectedItems = JSON.parse(localStorage.getItem('selectedItems'));

const Datatable = ({ items, columnConfig, onEdit }) => {
  const [page, setPage] = useState(storedPage || 1);
  const [itemsPerPage, setItemsPerPage] = useState(storedItemsPerPage || 5);

  const [searchValue, setSearchValue] = useState(storedSearchValue || '');
  const [highlightedValue, setHighlitedValue] = useState(
    storedHighlightedValue || ''
  );

  const [activeColumn, setActiveColumn] = useState(storedActiveColumn || null);
  const [direction, setDirection] = useState(storedDirection || null);
  const [sortType, setSortType] = useState(storedSortType || '');
  const [selectedItems, setSelectedItems] = useState(storedSelectedItems || []);

  const [itemToEditId, setItemToEditId] = useState(0);
  const [itemToEditField, setItemToEditField] = useState('');
  const [editedValue, setEditedValue] = useState('');

  const switchPage = ($, data) => {
    setPage(data.activePage);
  };

  const changeItemsPerPage = ($, data) => {
    setItemsPerPage(data.value);
    setPage(1);
  };

  const applySearchWithDebounce = _.debounce((value) => {
    setSearchValue(value);
  }, 500);

  const searchItems = ($, data) => {
    const value = data.value.toLowerCase().slice(0, 37);

    setPage(1);
    setHighlitedValue(value);
    applySearchWithDebounce(value);
  };

  const highlightText = (text) => {
    if (!highlightedValue || text === '') {
      return text;
    }

    const parts = text.split(new RegExp(`(${highlightedValue})`, 'gi'));

    return parts.map((part, i) => (
      <Fragment key={`${part + i}`}>
        {part.toLowerCase() === highlightedValue.toLowerCase()
          ? <span style={{ backgroundColor: 'green' }}>{part}</span>
          : part}
      </Fragment>
    ));
  };

  const handleSort = (clickedColumn, currentSortType) => {
    if (!currentSortType) {
      return;
    }

    setSortType(currentSortType);

    if (activeColumn !== clickedColumn) {
      setActiveColumn(clickedColumn);
      setDirection('ascending');
    } else {
      setDirection(direction === 'ascending' ? 'descending' : 'ascending');
    }
  };

  const toggleItem = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems([...selectedItems].filter(
        selectedItemId => selectedItemId !== itemId
      ));
    } else {
      const newSelectedItems = [...selectedItems];

      newSelectedItems.push(itemId);

      setSelectedItems(newSelectedItems);
    }
  };

  const toggleAllItems = () => {
    items.length !== selectedItems.length
      ? setSelectedItems(items.map(item => item.id))
      : setSelectedItems([]);
  };

  const setEditState = (currentItem, value) => {
    setItemToEditId(currentItem.id);
    setEditedValue(value);

    _.keys(currentItem).forEach((key) => {
      if (currentItem[key] === value) {
        setItemToEditField(key);
      }
    });
  };

  const setNewCellValue = ($, data) => {
    setEditedValue(data.value);
  };

  const editItem = () => {
    const itemToedit = items.find(item => item.id === itemToEditId);

    toggleItem(itemToedit);

    if (editedValue !== itemToedit[itemToEditField]) {
      const editedItem = {
        ...itemToedit,
        [itemToEditField]: editedValue,
      };

      onEdit(editedItem);
    }

    setItemToEditId(0);
  };

  const editOnBlur = () => {
    editItem();
  };

  const editWithKey = (event) => {
    if (event.key === 'Enter') {
      editItem();
    }

    if (event.key === 'Escape') {
      setItemToEditId(0);
    }
  };

  useEffect(() => {
    localStorage.setItem('originalItems', JSON.stringify(items));
    localStorage.setItem('page', JSON.stringify(page));
    localStorage.setItem('itemsPerPage', JSON.stringify(itemsPerPage));
    localStorage.setItem('searchValue', JSON.stringify(searchValue));
    localStorage.setItem('highlightedValue', JSON.stringify(highlightedValue));
    localStorage.setItem('activeColumn', JSON.stringify(activeColumn));
    localStorage.setItem('direction', JSON.stringify(direction));
    localStorage.setItem('sortType', JSON.stringify(sortType));
    localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
  });

  const value = searchValue.toLowerCase();
  const searchedItems = items.filter(item => (
    _.keys(columnConfig)
      .filter(key => columnConfig[key].isSearchable)
      .some(key => item[key].toLowerCase().includes(value))
  ));

  const by = {
    string: (a, b) => a[activeColumn].localeCompare(b[activeColumn]),
    number: (a, b) => a[activeColumn] - b[activeColumn],
  };
  const callback = by[sortType] || (() => 0);
  const sortedItems = searchedItems.sort(callback);

  if (direction === 'descending') {
    _.reverse(sortedItems);
  }

  const totalItemsAmount = sortedItems.length;
  const pagesAmount = Math.ceil(totalItemsAmount / itemsPerPage);
  const firstItem = (page - 1) * itemsPerPage + 1;
  const lastItem = page * itemsPerPage;
  const visibleItems = sortedItems.slice(firstItem - 1, lastItem);

  return (
    <div className="table-wrapper">
      <Header
        onChangeItemsPerPage={changeItemsPerPage}
        onSearchItems={searchItems}
        inputValue={highlightedValue}
        selectValue={itemsPerPage}
      />

      <Table striped sortable selectable celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className={cn('header')}>
              <Checkbox
                toggle
                onChange={toggleAllItems}
                checked={items.every(item => selectedItems.includes(item.id))}
              />
            </Table.HeaderCell>

            {_.map(columnConfig, (column, key) => (
              <Table.HeaderCell
                style={{ textAlign: 'center' }}
                key={column.title}
                sorted={activeColumn === column ? direction : null}
                onClick={() => handleSort(key, column.sortType)}
                // className={column.title === 'Название' && 'name-header'}
                className={cn(
                  'header',
                  (column.title === 'Описание' && 'snipet-header'),
                )}
              >
                {column.title}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {_.map(visibleItems, item => (
            <Table.Row key={item.imageUrl}>
              <Table.Cell>
                <Checkbox
                  toggle
                  checked={selectedItems.includes(item.id)}
                  onChange={() => toggleItem(item.id)}
                />
              </Table.Cell>

              {itemToEditId === item.id
                && item[itemToEditField] === item.name ? (
                  <Table.Cell style={{ padding: 0 }}>
                    <Form>
                      <Form.TextArea
                        defaultValue={item.name}
                        onChange={setNewCellValue}
                        onKeyDown={editWithKey}
                        onBlur={editOnBlur}
                      />
                    </Form>
                  </Table.Cell>
                ) : (
                  <Table.Cell
                    onDoubleClick={() => setEditState(item, item.name)}
                  >
                    {highlightText(item.name)}
                  </Table.Cell>
                )}

              {itemToEditId === item.id
                && item[itemToEditField] === item.age ? (
                  <Table.Cell style={{ padding: 0 }}>
                    <Form>
                      <Form.TextArea
                        defaultValue={item.age}
                        onChange={setNewCellValue}
                        onKeyDown={editWithKey}
                        onBlur={editOnBlur}
                      />
                    </Form>
                  </Table.Cell>
                ) : (
                  <Table.Cell
                    onDoubleClick={() => setEditState(item, item.age)}
                  >
                    {item.age}
                  </Table.Cell>
                )}

              {itemToEditId === item.id
                && item[itemToEditField] === item.snippet ? (
                  <Table.Cell style={{ padding: 0 }}>
                    <Form>
                      <Form.TextArea
                        defaultValue={item.snippet}
                        onChange={setNewCellValue}
                        onKeyDown={editWithKey}
                        onBlur={editOnBlur}
                      />
                    </Form>
                  </Table.Cell>
                ) : (
                  <Table.Cell
                    onDoubleClick={() => setEditState(item, item.snippet)}
                  >
                    {highlightText(item.snippet)}
                  </Table.Cell>
                )}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <Footer
        firstTableItem={firstItem}
        lastTableItem={lastItem}
        entries={totalItemsAmount}
        onSwitchPage={switchPage}
        pagesAmount={pagesAmount}
        activePage={page}
      />
    </div>
  );
};

Datatable.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.object
  ).isRequired,
  columnConfig: PropTypes.objectOf(
    PropTypes.object
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default Datatable;

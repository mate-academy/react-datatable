import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Table, Checkbox, Input } from 'semantic-ui-react';
import Header from './Header';
import Footer from './Footer';

const Datatable = ({ items, columnConfig }) => {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchValue, setSearchValue] = useState('');
  const [highlightedValue, setHighlitedValue] = useState('');
  const [activeColumn, setActiveColumn] = useState(null);
  const [direction, setDirection] = useState(null);
  const [sortType, setSortType] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [itemToEdit, setItemToEdit] = useState({});
  const [editValue, setEditValue] = useState('');

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
    if (!highlightedValue) {
      return text;
    }

    const parts = text.split(new RegExp(`(${highlightedValue})`, 'gi'));

    return _.map(parts, (part, i) => (
      <Fragment key={`${part + i}`}>
        {part.toLowerCase() === highlightedValue.toLowerCase()
          ? <span className="highlighted-text">{part}</span>
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

  const toggleItem = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems([...selectedItems].filter(
        selectedItem => selectedItem !== item
      ));
    } else {
      const newSelectedItems = [...selectedItems];

      newSelectedItems.push(item);

      setSelectedItems(newSelectedItems);
    }
  };

  const toggleAllItems = () => {
    items.length !== selectedItems.length
      ? setSelectedItems(items)
      : setSelectedItems([]);
  };

  const editCell = (item, value) => {
    setItemToEdit(item);
    setEditValue(value);
  }

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
  const visibleItems = sortedItems.slice(firstItem - 1, lastItem)
    .map(item => {
      if (item === itemToEdit) {
        return {
          ...item,
          isEditable: true,
        }
      }

      return item;
    });
  console.log(visibleItems);

  return (
    <div className="table-wrapper">
      <Header
        onChangeItemsPerPage={changeItemsPerPage}
        onSearchItems={searchItems}
      />

      <Table striped sortable selectable celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              <Checkbox
                toggle
                onChange={toggleAllItems}
                checked={selectedItems.length === items.length}
              />
            </Table.HeaderCell>

            {_.map(columnConfig, (column, key) => (
              <Table.HeaderCell
                style={{ textAlign: 'center', }}
                key={column.title}
                sorted={activeColumn === column ? direction : null}
                onClick={() => handleSort(key, column.sortType)}
              >
                {column.title}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {_.map(visibleItems, item => (
            item.isEditable ? (
              // <Table.Row>
                // <Table.Cell>
                <Input
                  value={editValue}
                  className="edit-input"
                />
                // </Table.Cell>
              // </Table.Row>

            ) : (
              <Table.Row key={item.name}>
                <Table.Cell>
                  <Checkbox
                    toggle
                    checked={selectedItems.includes(item)}
                    onChange={() => toggleItem(item)}
                  />
                </Table.Cell>

                <Table.Cell onDoubleClick={() => editCell(item, item.name)}>
                  {highlightText(item.name)}
                </Table.Cell>

                <Table.Cell onDoubleClick={() => editCell(item, item.age)}>
                  {item.age}
                </Table.Cell>

                <Table.Cell onDoubleClick={() => editCell(item, item.snippet)}>
                  {highlightText(item.snippet)}
                </Table.Cell>
              </Table.Row>
            )
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
};

export default Datatable;

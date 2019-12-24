import React from 'react';
import PropTypes from 'prop-types';
import { Input, Select } from 'semantic-ui-react';

const itemsPerPageOptions = [
  {
    key: 2, value: 2, text: '2 phones per page',
  },
  {
    key: 3, value: 3, text: '3 phones per page',
  },
  {
    key: 5, value: 5, text: '5 phones per page',
  },
  {
    key: 10, value: 10, text: '10 phones per page',
  },
  {
    key: 20, value: 20, text: '20 phones per page',
  },
];

const Header = ({ onChangeItemsPerPage, onSearchItems }) => (
  <div className="table-options">
    <Select
      placeholder="Select phones per page"
      options={itemsPerPageOptions}
      onChange={onChangeItemsPerPage}
    />

    <Input
      icon="search"
      placeholder="Search..."
      iconPosition="left"
      type="search"
      onChange={onSearchItems}
    />
  </div>
);

Header.propTypes = {
  onChangeItemsPerPage: PropTypes.func.isRequired,
  onSearchItems: PropTypes.func.isRequired,
};

export default Header;

import React from 'react';
import PropTypes from 'prop-types';

export const Select = ({ perPage, changePage }) => {
  const param = [5, 10, 15, 20];

  return (
    <select
      className="custom-select mySelect"
      value={perPage}
      onChange={changePage}
    >
      {param.map(item => (
        <option
          value={item}
          key={item}
        >
          {item}
        </option>
      ))}
    </select>

  );
};

Select.propTypes = {
  perPage: PropTypes.number.isRequired,
  changePage: PropTypes.func.isRequired,
};

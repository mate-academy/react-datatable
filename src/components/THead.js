import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

export const THead = ({
  columnConfig,
  selected,
  selectAllPhones,
  sortPhonesBy,
}) => (
  <thead>
    <tr>
      {Object.values(columnConfig).map((config, i) => (
        <th
          scope="col"
          key={config.title}
          className={cn({
            myTitle: i === 0,
            isNotSelectAll: !selected && i === 0,
            isSelectAll: selected && i === 0,
            tHead: true,
          })}
          onClick={() => {
            if (i === 0) {
              selectAllPhones();
            }

            if (config.sortType) {
              sortPhonesBy(config.sortType, config.title);
            }
          }}
        >
          {i === 0 ? (
            <span className="titleSelect">{config.title}</span>
          ) : config.title}
        </th>
      ))}
    </tr>
  </thead>
);

THead.propTypes = {
  selected: PropTypes.bool.isRequired,
  selectAllPhones: PropTypes.func.isRequired,
  sortPhonesBy: PropTypes.func.isRequired,
};

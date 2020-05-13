import React from 'react';
import cn from 'classnames';

export const THead = ({
  columnConfig, selected, selectAllPhones, sortPhonesBy
}) => {

  return (
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
            {config.title}
          </th>
        ))}
      </tr>
    </thead>
  )
};

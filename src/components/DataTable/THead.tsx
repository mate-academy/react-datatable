import React from 'react';

type Props = {
  columnConfig: ColumnConfig;
  isSelectedAll: boolean;
  sortReverse: boolean;
  onSelectionChanged?: (id: string | null) => void;
  onSort: (name: string, field: SortField) => void;
};

export const THead: React.FC<Props> = ({
  columnConfig,
  isSelectedAll,
  sortReverse,
  onSelectionChanged,
  onSort,
}) => {
  return (
    <thead>
      <tr>
        {onSelectionChanged && (
          <th>
            <input
              type="checkbox"
              checked={isSelectedAll}
              onChange={() => onSelectionChanged(null)}
            />
          </th>
        )}
        {Object.entries(columnConfig).map(([name, field]) => (
          <th
            className="table-headers"
            key={field.title}
            onClick={() => onSort(name, field)}
          >
            {field.title}
            {!sortReverse && field.sortType && (
              <span className="icon">
                <span className="fas fa-angle-down" aria-hidden="true" />
              </span>
            )}
            {sortReverse && field.sortType && (
              <span className="icon">
                <span className="fas fa-angle-up" aria-hidden="true" />
              </span>
            )}
          </th>
        ))}
      </tr>
    </thead>
  )
}

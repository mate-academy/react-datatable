import React from 'react';

type Props = {
  columnConfig: ColumnConfig;
  isSelectedAll: boolean;
  sortField: string;
  sortReverse: boolean;
  onSelectionChanged?: (id: string | null) => void;
  onSort: (name: string, field: SortField) => void;
};

export const THead: React.FC<Props> = ({
  columnConfig,
  isSelectedAll,
  sortField,
  sortReverse,
  onSelectionChanged,
  onSort,
}) => {
  return (
    <thead>
      <tr>
        {onSelectionChanged && (
          <th className="table-headers table-headers-checkbox">
            <input
              type="checkbox"
              checked={isSelectedAll}
              onChange={() => onSelectionChanged(null)}
            />
          </th>
        )}
        {Object.entries(columnConfig).map(([name, field]) => (
          <th
            className={`table-headers table-headers-${name}`}
            key={field.title}
            onClick={() => onSort(name, field)}
          >
            {field.title}
            {!sortReverse && sortField === name && (
              <span className="icon">
                <span className="fas fa-angle-down" aria-hidden="true" />
              </span>
            )}
            {sortReverse && sortField === name && (
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

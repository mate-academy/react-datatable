import React from 'react';

type Props = {
  filterQuery: string;
  setFilterQuery: (value: string) => void;
}

export const Search: React.FC<Props> = ({ filterQuery, setFilterQuery }) => {
  return (
    <div className="field">
      <div className="control">
        <input
          type="text"
          className="input is-info"
          placeholder="Text input"
          value={filterQuery}
          onChange={e => setFilterQuery(e.target.value)}
        />
      </div>
    </div>
  )
}

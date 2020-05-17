import React from 'react';

interface Props {
  perPage: number;
  changePage: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export const Select: React.FC<Props> = ({ perPage, changePage }) => {
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

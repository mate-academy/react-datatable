import React, { useState } from 'react';
import { PhoneCells } from './PhoneCells';

type Props = {
  phones: Phone[];
  allPhones: Phone[];
  columnConfig: ColumnConfig;
  onSelectionChanged?: (id: string | null) => void;
  setPhones: (phones: Phone[]) => void;
};

export const TBody: React.FC<Props> = ({
  phones,
  allPhones,
  columnConfig,
  onSelectionChanged,
  setPhones,
}) => {


  return (
    <tbody>
      {phones.map((phone) => (
        <tr key={phone.id}>
          {onSelectionChanged && (
            <td>
              <input
                type="checkbox"
                checked={phone.selected}
                onChange={() => onSelectionChanged(phone.id)}
              />
            </td>
          )}
          <PhoneCells
            allPhones={allPhones}
            phone={phone}
            columnConfig={columnConfig}
            setPhones={setPhones}
          />
        </tr>
      ))}
    </tbody>
  )
}

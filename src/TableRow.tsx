import React from 'react';
import { TableRowType } from './interfaces';
import { TableCell } from './TableCell';

export const TableRow = ({
  phone,
  handleRowClick,
  onSelectionChanged,
  heads,
  initialPhones,
  setInitialPhones,
}: TableRowType) => {
  let trigger: ReturnType<typeof setTimeout>;
  let isFirstClick = true;
  const isSingleClickChecker = () => {
    if (isFirstClick) {
      trigger = setTimeout(() => handleRowClick(phone.id), 200);
      isFirstClick = false;
    } else {
      clearTimeout(trigger);
      isFirstClick = true;
    }
  }

  return (
    <tr
      key={`rowOf${phone.id}`}
      className={phone.isSelected ? "selected" : ''}
      onClick={isSingleClickChecker}
    >
      {typeof onSelectionChanged === 'function' ?
        <td>
          <input
            type='checkbox'
            checked={phone.isSelected}
            onChange={() => {}}
          >
          </input>
        </td> : ''}

      {heads.map((head: string) => {
        return (
          <TableCell
          key={phone.id + head}
            value={phone[head]}
            phoneId={phone.id}
            head={head}
            initialPhones={initialPhones}
            setInitialPhones={setInitialPhones}
          />

        )
      })}
    </tr>)
}

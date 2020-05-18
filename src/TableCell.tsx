import React, { useState } from 'react';
import { TableCellPropsType } from './interfaces';

export const TableCell = ({
  value,
  initialPhones,
  setInitialPhones,
  phoneId,
  head,
}: TableCellPropsType) => {
  const [isEdited, setIsEdited] = useState(false);
  const [newValue, setNewValue] = useState(value);

  const handleDoubleClick = () => {
    setIsEdited(true)
  }

  const handleBlur = () => {
    setValueToOrigin();
    setIsEdited(false);
  }

  const setValueToOrigin = () => {
    setInitialPhones(
      [...initialPhones].map((phone) => {
        if(phone.id === phoneId) {
          phone[head] = newValue;
        }
        return phone;
      })
    );


  }

  const handleKeyDown = (event:React.KeyboardEvent<HTMLTextAreaElement>) => {
    if(event.key === 'Enter') {
      setValueToOrigin();
      setIsEdited(false);
    }
    if(event.key === 'Escape') {
      setIsEdited(false);
      setNewValue(value)
    }
  }

  return (
    <td
      className="table__cell"
      onDoubleClick={handleDoubleClick}
      key={new Date().getTime()}
    >
      {isEdited ?
      <>
      <textarea
        autoFocus={true}
        className="table__textarea"
        value={newValue}
        onKeyDown={handleKeyDown}
        onClick={(event) => {event.stopPropagation()}}
        onChange={(event) => setNewValue(event.target.value)}
        onBlur={handleBlur}
      />
      </> :
        <p>
          {value}
        </p>}
    </td>
  )
}

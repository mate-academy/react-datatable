import React, { useState } from 'react';
import { THead } from './THead';
import cn from 'classnames';

interface Props {
  columnConfig: ColumnConf;
  items: Phone[];
  selected: boolean;
  changeStatus: (id: string) => void;
  selectAllPhones: () => void;
  sortPhonesBy: (sortParam: string, sortTitle: string) => void;
  editCell: (id: string, value: string, configParam: string) => void;
}

export const DataTable: React.FC<Props> = ({
  columnConfig,
  items,
  selected,
  changeStatus,
  selectAllPhones,
  sortPhonesBy,
  editCell,
}) => {
  const configs = Object.keys(columnConfig).slice(1);
  const [editingValue, setEditingValue] = useState('');
  const [editingInputId, setEditingInputId] = useState('');
  const [editingConfig, setEditingConfig] = useState('');
  const [inputError, setInputError] = useState(false);

  const handleEditing = (id: string, config: string, value: string | number | boolean) => {
    setEditingInputId(id);
    setEditingConfig(config);
    setEditingValue(value as string);
    setInputError(false);
  }

  const validation = (e: React.KeyboardEvent | null, config: string) => {
    if (!e || e.key === 'Enter') {
      if (!editingValue) {
        setInputError(true);
        return;
      }

      if (config === 'age') {
        if (/\D/g.test(editingValue)) {
          setInputError(true);
          return;
        }
      }

      saveValue()
    }

    if (e && e.key === 'Escape') {
      reset();
    }
  }

  const saveValue = () => {
    editCell(editingInputId, editingValue, editingConfig);
    reset();
  }

  const reset = () => {
    setEditingValue('');
    setEditingInputId('');
    setEditingConfig('');
    setInputError(false);
  }

  return (
    <table className="table table-dark">
      <THead
        columnConfig={columnConfig}
        selected={selected}
        selectAllPhones={selectAllPhones}
        sortPhonesBy={sortPhonesBy}
      />
      <tbody>
        {items.map((phone: Phone) => (
          <tr key={phone.id}>
            <th scope="row">
              <input
                type="checkbox"
                className="custom-checkbox"
                checked={phone.checked}
                onChange={() => changeStatus(phone.id)}
                id={`${phone.id}`}
              />
              <label htmlFor={`${phone.id}`} />
            </th>
            {configs.map(config => (
              <td
                className={cn(
                  { editing: editingInputId === phone.id && config === editingConfig },
                )}
                onDoubleClick={() => handleEditing(phone.id, config, phone[config])}
              >
                <input
                  type="text"
                  value={editingValue}
                  className="input"
                  onChange={e => {
                    setEditingValue(e.target.value)

                    if (e.target.value) {
                      setInputError(false);
                    }
                  }}
                  autoFocus={true}
                  onKeyDown={e => validation(e, config)}
                  onBlur={() => validation(null, config)}
                />
                {inputError
                  && editingInputId === phone.id
                  && config === editingConfig
                  && (
                    <p className="error">Please, write correctly {config}</p>
                  )}
                <p className={cn(
                  { none: editingInputId === phone.id && config === editingConfig }
                )}>{phone[config]}</p>
              </td>
            ))}
          </tr>
        ))}

      </tbody>
    </table>
  );
};

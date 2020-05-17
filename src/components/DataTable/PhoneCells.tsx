import React, { useState } from 'react';

type Props = {
  allPhones: Phone[];
  phone: Phone;
  columnConfig: ColumnConfig;
  setPhones: (phones: Phone[]) => void;
};

export const PhoneCells: React.FC<Props> = ({
  allPhones,
  phone,
  columnConfig,
  setPhones,
}) => {
  const [editPhoneId, setEditPhoneId] = useState('');
  const [editFieldName, setEditFieldName] = useState('');
  const [editFieldValue, setEditFieldValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const setEditingProps = (id: string, fieldName: string, fieldValue: string) => {
    setEditPhoneId(id);
    setEditFieldName(fieldName);
    setEditFieldValue(fieldValue);
    document.addEventListener('keyup', onKeyup);
  };

  const setDefaultState = () => {
    setEditPhoneId('');
    setEditFieldName('');
    setEditFieldValue('');
    document.removeEventListener('keyup', onKeyup);
  }

  const onChangeFieldValue = (e: React.FormEvent<HTMLInputElement>) => {
    setErrorMessage('');
    setEditFieldValue(e.currentTarget.value)
  }

  const onButtonCancelClick = () => {
    setEditFieldValue('');
  }

  const onKeyup = (e: KeyboardEvent) => {
    if (e.code === 'Escape') {
      setDefaultState();
    }
  }

  const validateField = (name: keyof ColumnConfig, value: string) => {
    const { validators = [] } = columnConfig[name];

    return validators
      .map((validator: Validator) => validator(name as string, value))
      .filter(Boolean)
      .join(', ');
  };

  const saveChanges = (e: React.FormEvent) => {
    e.preventDefault();

    const error = validateField(editFieldName, editFieldValue);

    if (error) {
      setErrorMessage(validateField(editFieldName, editFieldValue));

      return;
    }

    setPhones([...allPhones.map(phone => {
      return (phone.id === editPhoneId)
        ? {
          ...phone,
          [editFieldName]: editFieldValue,
        }
        : phone;
    })]);

    setDefaultState();
  };

  return (
    <>
      {Object.keys(columnConfig).map((key) => (
        <td
          key={key}
          onDoubleClick={() => setEditingProps(phone.id, key, phone[key])}
        >
          {(editPhoneId !== phone.id || editFieldName !== key) && phone[key]}
          {(editPhoneId === phone.id && editFieldName === key) && (
            <form onSubmit={e => saveChanges(e)} className="editing-form">
              <input
                type="text"
                className="input is-info"
                value={editFieldValue}
                autoFocus={true}
                onChange={e => onChangeFieldValue(e)}
                onBlur={e => saveChanges(e)}
              />
              <button
                type="button"
                className="delete is-small"
                onClick={onButtonCancelClick}
              />
              {errorMessage && (
                <article className="message is-danger">
                  <div className="message-body">
                    {errorMessage}
                  </div>
                </article>
              )}
            </form>
          )}
        </td>
      ))}
    </>
  )
}

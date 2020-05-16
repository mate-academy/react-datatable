export const required: Validator = (name, value) => {
  if (value) {
    return '';
  }

  return `${name} is required`;
};

export const url: Validator = (name, value) => {
  // eslint-disable-next-line max-len
  const URL_REGEXP = /^((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)$/;

  return URL_REGEXP.test(value)
    ? ''
    : `${name} should be a valid URL`;
};

export const minLength = (length: number): Validator => {
  return (name, value) => {
    return !value || (value.length >= length)
      ? ''
      : `${name} should have at least ${length} characters`;
  };
};


export const dataType = (type: string): Validator => {
  return (name, value) => {
    if (type === 'number') {
      return !value || (Number.isInteger(+value))
      ? ''
      : `${name} should be ${type}`;
    }

    return !value || (typeof value === type)
      ? ''
      : `${name} should be ${type}`;
  };
}

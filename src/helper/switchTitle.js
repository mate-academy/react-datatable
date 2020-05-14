export const switchTitle = (param) => {
  switch (param) {
    case 'Название':
      return 'name';

    case 'Возраст':
      return 'age';

    case 'Описание':
      return 'snippet';

    default:
      return 'age';
  }
};

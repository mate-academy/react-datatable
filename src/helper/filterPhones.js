import { switchTitle } from './switchTitle';

export const filterPhones = (columnConfig, items, searchValue) => {
  if (!searchValue ) {
    return items;
  }

  const valueForSearch = Object
    .values(columnConfig)
    .filter(config => config.isSearchable);

  const searchKey = [];
  let filteredPhones;

  valueForSearch
    .map(phone => phone.title)
    .forEach(key => searchKey.push(switchTitle(key)));

  searchKey.forEach((key) => {
    filteredPhones = items.filter((phone) => {
      if (phone[key]
        .toLocaleLowerCase()
        .includes(searchValue
          .toLocaleLowerCase())) {
        return true;
      }
    });
  });

  return filteredPhones;
};

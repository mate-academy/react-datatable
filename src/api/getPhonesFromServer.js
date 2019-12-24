// eslint-disable-next-line
const PHONES_URL = 'https://mate-academy.github.io/phone-catalogue-static/api/phones.json';

export const getPhonesFromServer = async() => {
  const phonesData = await fetch(PHONES_URL);

  return phonesData.json();
};

export const getPhones = async() => {
  const phonesData = await fetch('./api/phones.json');
  let preparedData = await phonesData.json();

  preparedData = preparedData.map(data => ({
    ...data,
    checked: false,
  }));

  return preparedData;
};

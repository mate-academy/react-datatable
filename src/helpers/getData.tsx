const getData = async (url: string) => {
  const response = await fetch(url);
  const json = await response.json();

  return json;
};

export const getPhones = async () => {
  const phonesFromServer = await getData(`${process.env.REACT_APP_API_URL}/phones.json`);

  return phonesFromServer;
};

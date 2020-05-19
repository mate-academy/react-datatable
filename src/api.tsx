
export const getPhonesFromServer = () => {
  return fetch('https://mate-academy.github.io/phone-catalogue-static/api/phones.json')
    .then(response => response.json())
}


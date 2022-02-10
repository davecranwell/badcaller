// eslint-disable-next-line no-undef
let { REACT_APP_SERVER_URL: SERVER_URL = window.location.origin } = process.env

const urlBase = '/api/v1/country'

export const getCountry = async (limit) => {
  const url = new URL(urlBase, SERVER_URL)
  return fetch(url).then((response) => response.json())
}

export const setCountry = async (country) => {
  const url = new URL(urlBase, SERVER_URL)
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ country }),
  }).then((response) => response.json())
}

// eslint-disable-next-line no-undef
let { REACT_APP_SERVER_URL: SERVER_URL = window.location.origin } = process.env

export const getLatestCalls = async (limit) => {
  const url = new URL('/api/v1/calls', SERVER_URL)
  const params = {
    '$sort[timestamp]': -1,
    $limit: 5,
  }

  url.search = new URLSearchParams(params).toString()

  return fetch(url).then((response) => response.json())
}

export const renameCaller = async (number, name) => {
  const url = new URL('/api/v1/contact', SERVER_URL)
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ number, name }),
  }).then((response) => response.json())
}

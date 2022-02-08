// eslint-disable-next-line no-undef
let { REACT_APP_SERVER_URL: SERVER_URL = window.location.origin } = process.env

export const getLatestCalls = async (limit) => {
  const url = new URL('/api/calls', SERVER_URL)
  const params = {
    '$sort[timestamp]': -1,
    $limit: 5,
  }

  url.search = new URLSearchParams(params).toString()

  return fetch(url).then((response) => response.json())
}

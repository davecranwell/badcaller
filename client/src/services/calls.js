// eslint-disable-next-line no-undef
let { serverUrl = window.location.origin } = CONFIG

export const getLatestCalls = async (limit) => {
  const url = new URL('/api/calls', serverUrl)
  const params = {
    '$sort[timestamp]': -1,
    $limit: 5,
  }

  url.search = new URLSearchParams(params).toString()

  return fetch(url).then((response) => response.json())
}

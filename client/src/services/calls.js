// eslint-disable-next-line no-undef
const { serverUrl } = CONFIG

const apiBaseUrl = `${serverUrl}/api`

export const getLatestCalls = async (limit) => {
  const url = new URL(`${apiBaseUrl}/calls`)
  const params = {
    '$sort[timestamp]': -1,
    $limit: 5,
  }

  url.search = new URLSearchParams(params).toString()

  return fetch(url).then((response) => response.json())
}

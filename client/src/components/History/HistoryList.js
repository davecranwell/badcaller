import { useEffect } from 'react'

import IsLoadingHoc from '../IsLoadingHoc'

import { formatNumber } from '../../utils'
import { getLatestCalls } from '../../services/calls'

function HistoryList({
  displayCallCount,
  onFetchCalls,
  calls,
  userCountry,
  setLoading,
}) {
  useEffect(() => {
    setLoading(true)
    getLatestCalls(displayCallCount).then((dataCalls) => {
      onFetchCalls(dataCalls)
      setLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {!calls.length && <p>You've received no calls yet.</p>}
      <ul className={'history-list'}>
        {calls.map((call) => (
          <HistoryItem
            key={call.timestamp}
            userCountry={userCountry}
            {...call}
          />
        ))}
      </ul>
    </>
  )
}

function HistoryItem({
  timestamp,
  number: numberObj = {},
  rating,
  userCountry,
}) {
  const sDate = new Date(timestamp)

  const numberToUse = formatNumber(numberObj, userCountry)

  return (
    <li className={'history-list-item'}>
      <div className="history-list-item--date">
        {sDate.toLocaleString([], {
          weekday: 'short',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
      <div className="history-list-item--number">{numberToUse}</div>
      <div className="history-list-item--rating">{rating}</div>
    </li>
  )
}

export default IsLoadingHoc(HistoryList)

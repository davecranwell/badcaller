import { useEffect } from 'react'

import IsLoadingHoc from '../IsLoadingHoc'

import { getLatestCalls } from '../../services/calls'

function HistoryList({ displayNumber, onFetchCalls, calls, setLoading }) {
  useEffect(() => {
    setLoading(true)
    getLatestCalls(displayNumber).then((dataCalls) => {
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
          <HistoryItem key={call.timestamp} {...call} />
        ))}
      </ul>
    </>
  )
}

function HistoryItem({ timestamp, number, rating }) {
  const sDate = new Date(timestamp)

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
      <div className="history-list-item--number">{number}</div>
      <div className="history-list-item--rating">{rating}</div>
    </li>
  )
}

export default IsLoadingHoc(HistoryList)

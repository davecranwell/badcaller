import { useEffect, useState } from 'react'
import EasyEdit, { Types } from 'react-easy-edit'

import IsLoadingHoc from '../IsLoadingHoc'

import { displayContact } from '../../utils'
import { getLatestCalls, renameCaller } from '../../services/calls'

function HistoryList({ displayCallCount, onFetchCalls, calls, userCountry }) {
  const [lastUpdated, setLastUpdated] = useState(Date.now())

  useEffect(() => {
    getLatestCalls(displayCallCount).then((dataCalls) => {
      onFetchCalls(dataCalls)
    })
  }, [lastUpdated, displayCallCount, onFetchCalls])

  return (
    <>
      {!calls.length && <p>You've received no calls yet.</p>}
      <ul className={'history-list'}>
        {calls.map((call) => (
          <HistoryItem
            key={call.timestamp}
            userCountry={userCountry}
            onRenameCaller={() => setLastUpdated(Date.now())}
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
  onRenameCaller,
}) {
  const sDate = new Date(timestamp)

  const contact = displayContact(numberObj, userCountry)

  const handleRename = async (value) => {
    return renameCaller(numberObj.number, value).then(() => {
      onRenameCaller()
    })
  }

  return (
    <li className={'history-list-item'}>
      <div className="history-list-item--date">
        {sDate.toLocaleString([], {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
      <div className="history-list-item--number">
        <EasyEdit
          value={contact}
          type={Types.TEXT}
          onSave={handleRename}
          saveButtonLabel="Save"
          cancelButtonLabel="Cancel"
          attributes={{}}
        />
      </div>
      <div className="history-list-item--rating">{rating}</div>
    </li>
  )
}

export default IsLoadingHoc(HistoryList)

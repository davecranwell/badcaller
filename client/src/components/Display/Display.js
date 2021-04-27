import Spinner from '../Spinner/Spinner'

import './Display.css'

function Display({ callActive, number, rating }) {
  return (
    <div
      className={`
        display ${rating ? `display--${rating}` : ''} 
        ${`display--${callActive ? 'callactive' : 'callinactive'}`}
      `}
    >
      {callActive && (
        <>
          <h1 className="incoming-call">
            <span className="incoming-call-label">
              {callActive && 'Incoming call from'}
            </span>
            <span className="incoming-call-number">
              {number || ''} {!number && <Spinner />}
            </span>
          </h1>
          <h2 className="rating">
            <span className="rating-label">{callActive && 'Rated as'}</span>
            <span className="rating-score">
              {rating} {!rating && <Spinner />}
            </span>
          </h2>
        </>
      )}

      {!callActive && <h1 className="idle-label">No call currently active</h1>}
    </div>
  )
}

export default Display

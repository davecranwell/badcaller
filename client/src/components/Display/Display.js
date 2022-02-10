import Spinner from '../Spinner/Spinner'

import './Display.css'

function Display({ ringing, numberObj = {}, rating, userCountry }) {
  const { country, international, national, number } = numberObj

  const numberToUse =
    userCountry === country ? national || number : international || number

  return (
    <div className={'display'}>
      {ringing && (
        <>
          <h1 className="incoming-call">
            <span className="incoming-call-label">
              {ringing && 'Incoming call from'}
            </span>
            <span
              className="incoming-call-number"
              style={{
                '--number-length': (numberToUse && numberToUse.length) || 0,
              }}
            >
              {numberToUse || ''} {!numberToUse && <Spinner />}
            </span>
          </h1>
          {numberToUse && (
            <h2 className="rating">
              <span className="rating-label">{ringing && 'Rated as'}</span>
              <span
                className="rating-score"
                style={{
                  '--number-length': (numberToUse && numberToUse.length) || 0,
                }}
              >
                {rating} {!rating && <Spinner />}
              </span>
            </h2>
          )}
        </>
      )}

      {!ringing && (
        <div className={'idle'}>
          <h1 className="idle-label">No call currently active</h1>
          <p>When you receive a call, it will be displayed here.</p>
        </div>
      )}
    </div>
  )
}

export default Display

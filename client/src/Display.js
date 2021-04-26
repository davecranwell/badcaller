import './Display.css'

function Display({ callActive, number, rating }) {
  return (
    <div className={`display ${rating ? `display--${rating}` : ''}`}>
      <h1 className="incoming-call">
        <span className="incoming-call-label">
          {callActive && 'Incoming call from'}
        </span>
        <span className="incoming-call-number">{number}</span>
      </h1>
      <h2 className="rating">
        <span className="rating-label">{callActive && 'Rated as'}</span>
        <span className="rating-score">{rating}</span>
      </h2>
    </div>
  )
}

export default Display

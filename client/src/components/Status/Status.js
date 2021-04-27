import './Status.css'

function Status({ disconnected, connectionError }) {
  if (!disconnected && !connectionError) return null

  return (
    <div className="status">
      <div>
        {connectionError &&
          'Could not connect to phone line monitor (Raspberry Pi)'}
      </div>
      <div>
        {disconnected && 'Connection lost to phone line monitor (Raspberry Pi)'}
      </div>
    </div>
  )
}

export default Status

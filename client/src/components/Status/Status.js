import './Status.css'

function Status({ connected, disconnected, connectionError }) {
  if (connected && !disconnected && !connectionError) return null

  return (
    <div className="status">
      <div>
        {!connected &&
          !connectionError &&
          !disconnected &&
          'Connecting to phone line monitor (Raspberry Pi)'}
      </div>
      <div>
        {(connectionError || disconnected) &&
          'Unable to connect to phone line monitor (Raspberry Pi)'}
      </div>
    </div>
  )
}

export default Status

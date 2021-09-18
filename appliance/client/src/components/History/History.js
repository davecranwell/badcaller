import './History.css'

function History({ connected, children }) {
  return (
    <div className={'history history--inverse'}>
      <h2 className={'history-title'}>Recent calls</h2>

      {connected && children}
    </div>
  )
}

export default History

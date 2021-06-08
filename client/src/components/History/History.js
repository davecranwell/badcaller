import './History.css'

function History({ newCall, children }) {
  return (
    <div className={'history history--inverse'}>
      <h2 className={'history-title'}>Recent calls</h2>
      {children}
    </div>
  )
}

export default History

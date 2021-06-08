import { useReducer } from 'react'

import { useSocketEffect } from '../../utils'

import './Status.css'

function reducer(state, action) {
  const { type } = action

  switch (type) {
    case 'connect':
      return {
        ...state,
        connected: true,
        connectionError: false,
        disconnected: false,
      }
    case 'connectError':
      return {
        ...state,
        connected: false,
        connectionError: true,
      }
    case 'disconnected':
      return {
        ...state,
        connected: false,
        disconnected: true,
      }
    default:
      return state
  }
}

function Status() {
  const [state, dispatch] = useReducer(reducer, {
    connected: false,
    connectionError: false,
    disconnected: false,
  })

  useSocketEffect({
    connect: (err) => dispatch({ type: 'connect' }),
    connect_error: (err) => dispatch({ type: 'connectError' }),
    disconnected: (err) => dispatch({ type: 'disconnected' }),
  })

  const { connected, disconnected, connectionError } = state

  if (connected && !disconnected && !connectionError) return null

  return (
    <div className="status">
      {!connected &&
        !connectionError &&
        !disconnected &&
        'Connecting to phone line monitor (Raspberry Pi)'}

      {(connectionError || disconnected) &&
        'Unable to connect to phone line monitor (Raspberry Pi)'}
    </div>
  )
}

export default Status

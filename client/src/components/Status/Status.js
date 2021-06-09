import { useReducer } from 'react'
import classnames from 'classnames'

import { useSocketEffect } from '../../utils'

import styles from './Status.module.scss'

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

  const isFirstConnection = !connected && !connectionError && !disconnected
  const isOnError = connectionError || disconnected

  return (
    <div
      className={classnames(styles.status, {
        [styles['status--info']]: isFirstConnection,
        [styles['status--error']]: isOnError,
      })}
    >
      {isFirstConnection && 'Connecting to phone line monitor (Raspberry Pi)'}

      {isOnError && 'Unable to connect to phone line monitor (Raspberry Pi)'}
    </div>
  )
}

export default Status

import { useReducer, useEffect } from 'react'
import socketio from 'socket.io-client'

import Display from '../Display/Display'
import Status from '../Status/Status'

import './App.css'

// eslint-disable-next-line
const { socketUrl } = CONFIG

function reducer(state, action) {
  const { type, data } = action

  switch (type) {
    case 'CONNECT':
      return {
        ...state,
        connected: true,
        connectionError: false,
        disconnected: false,
      }
    case 'CONNECT_ERROR':
      return {
        ...state,
        connected: false,
        connectionError: true,
      }
    case 'DISCONNECTED':
      return {
        ...state,
        connected: false,
        disconnected: true,
      }
    case 'RING':
      return {
        ...state,
        callActive: true,
      }
    case 'NUMB':
      return {
        ...state,
        number: data,
      }
    case 'LOOKEDUP':
      return {
        ...state,
        rating: data,
      }
    case 'NOT_RINGING':
      return {
        ...state,
        callActive: false,
        number: undefined,
        rating: undefined,
      }
    default:
      throw new Error()
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, {
    connected: false,
    callActive: false,
    number: undefined,
    rating: undefined,
    connectionError: false,
    disconnected: false,
  })

  useEffect(() => {
    const socket = socketio(socketUrl)

    socket.on('message', (data) => {
      dispatch(data)
    })
    socket.on('connect', (err) => {
      dispatch({ type: 'CONNECT' })
    })
    socket.on('connect_error', (err) => {
      dispatch({ type: 'CONNECT_ERROR' })
    })
    socket.on('disconnected', (err) => {
      dispatch({ type: 'DISCONNECTED' })
    })

    return () => socket.disconnect()
  }, [])

  const { connected, disconnected, connectionError } = state

  return (
    <div className="app">
      <Status
        connected={connected}
        disconnected={disconnected}
        connectionError={connectionError}
      ></Status>

      <Display {...state} />
    </div>
  )
}

export default App

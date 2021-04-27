import { useReducer, useEffect } from 'react'
import socketio from 'socket.io-client'

import Display from './Display'

import './App.css'

// eslint-disable-next-line
const { socketUrl } = CONFIG

function reducer(state, action) {
  const { type, data } = action

  switch (type) {
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
    callActive: false,
    number: undefined,
    rating: undefined,
  })

  useEffect(() => {
    const socket = socketio(socketUrl)
    socket.on('message', (data) => {
      dispatch(data)
    })

    return () => socket.disconnect()
  }, [])

  return (
    <div className="app">
      <Display {...state} />
    </div>
  )
}

export default App

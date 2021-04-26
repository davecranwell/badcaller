import { useContext, useReducer, useState, useCallback, useEffect } from 'react'

import { SocketContext } from './context/socket'
import Display from './Display'

import './App.css'

import socketio from 'socket.io-client'

function reducer(state, action) {
  console.log(state, action)
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
        // callActive: false,
        // number: undefined,
        // rating: undefined,
      }
    default:
      throw new Error()
  }
}

function App() {
  const socket = useContext(SocketContext)
  // const [data, setData] = use()
  const [state, dispatch] = useReducer(reducer, {
    callActive: false,
    number: undefined,
    rating: undefined,
  })

  useEffect(() => {
    const socket = socketio('http://localhost:8080')
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

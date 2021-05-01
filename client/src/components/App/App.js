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
    case 'NMBR':
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
      return state
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

  const { callActive, rating, connected, disconnected, connectionError } = state

  useEffect(() => {
    document.title = `
      ${rating ? `${rating}` : ''}
      ${callActive || (rating ? '|' : '')} Badcaller
    `
    const favicon = document.getElementById('favicon')

    const ratingColors = {
      dangerous: 'c9323b',
      harrassing: 'e96034',
      negative: 'e96034',
      neutral: '666',
      safe: '4a9401',
    }

    const faviconColor = ratingColors[rating] || '000'

    favicon.href = `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" x="0px" y="0px" fill="#fff"><g fill="#fff"><path fill="#${faviconColor}" d="M61.9,29.55A30,30,0,1,0,29.55,61.9,30.13,30.13,0,0,0,61.9,29.55ZM50,45.11l-2.24,2.24a10.61,10.61,0,0,1-5,2.81,16,16,0,0,1-4,.07A19.59,19.59,0,0,1,30,46.84,45.49,45.49,0,0,1,23.16,41c-.49-.49-1-1-1.5-1.56-4.44-4.8-9.34-11.85-7.79-18.12a10.06,10.06,0,0,1,2-3.94,11.83,11.83,0,0,1,.91-1L19,14.13a1.5,1.5,0,0,1,1.23-.45.77.77,0,0,1,.46.19l4.45,4.45a3.73,3.73,0,0,1,0,5.26l-.87.87a3.94,3.94,0,0,0-.51,5A38.48,38.48,0,0,0,35.36,40.78a3.2,3.2,0,0,0,3.79-.43L40.53,39a3.72,3.72,0,0,1,5.26,0l4.45,4.45a.77.77,0,0,1,.18.46A1.5,1.5,0,0,1,50,45.11Z"/></g></svg>`
    )}`
  }, [callActive, rating])

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

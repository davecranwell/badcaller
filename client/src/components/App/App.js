import { useReducer, useState } from 'react'

import { useSocketEffect } from '../../utils'

import Head from '../Head'
import Display from '../Display/Display'
import Status from '../Status/Status'
import History from '../History/History'
import HistoryList from '../History/HistoryList'

import { ReactComponent as Logo } from '../../badcaller-logo.svg'

import './App.css'

function reducer(state, action) {
  const { type, data } = action

  switch (type) {
    case 'setCalls':
      return {
        ...state,
        calls: data,
      }
    case 'result':
      if (data.number && data.rating) {
        return {
          ...data,
          calls: [
            {
              timestamp: Date.now(),
              number: data.number,
              rating: data.rating,
            },
            // Remove the last item from the previous calls array
            ...state.calls.slice(0, state.calls.length - 1),
          ],
        }
      }
      break
    case 'progress':
      return {
        calls: state.calls,
        ...data,
      }
    default:
      return state
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, {
    calls: [],
    ringing: false,
    number: undefined,
    rating: undefined,
  })

  const [connected, setConnected] = useState(false)

  useSocketEffect({
    connect: () => setConnected(true),
    progress: (data) => dispatch({ type: 'progress', data }),
    result: (data) => dispatch({ type: 'result', data }),
  })

  const { ringing, number, rating, calls } = state

  return (
    <>
      <Logo className={'logo'} />
      <div className="app">
        <Head ringing={ringing} rating={rating} />
        <Status />

        <main
          className={`
          ${rating && ringing ? `state--${rating}` : ''} 
          ${`state--${ringing ? 'callactive' : 'callinactive'}`}
        `}
        >
          <Display ringing={ringing} number={number} rating={rating} />
          <History connected={connected}>
            <HistoryList
              calls={calls}
              onFetchCalls={(data) => dispatch({ type: 'setCalls', data })}
            />
          </History>
        </main>
      </div>
    </>
  )
}

export default App

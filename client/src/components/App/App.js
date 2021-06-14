import { useReducer, useState } from 'react'

import { useSocketEffect } from '../../utils'

import Head from '../Head'
import Display from '../Display/Display'
import Status from '../Status/Status'
import History from '../History/History'
import HistoryList from '../History/HistoryList'

import { ReactComponent as Logo } from '../../badcaller-logo.svg'

import useInput from '../useInput'

import './App.css'

const NUMBER_HISTORY_ITEMS = 5

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
        const newCalls =
          // Remove the last item from the previous calls array if the history
          // is already at max allowed length
          state.calls.length >= NUMBER_HISTORY_ITEMS
            ? [...state.calls.slice(0, state.calls.length - 1)]
            : [...state.calls]

        return {
          ...data,
          calls: [
            {
              timestamp: Date.now(),
              number: data.number,
              rating: data.rating,
            },
            ...newCalls,
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
  const [form, onCountryChange] = useInput({
    country: 'UK',
  })

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
            <form>
              <select
                className={'select'}
                name="email"
                selected={form.country}
                onChange={(e) => {
                  console.log(e.target.value)
                  return onCountryChange(e)
                }}
              >
                <option value="UK">UK (+44)</option>
                <option value="US">US (+1)</option>
              </select>
            </form>
            <HistoryList
              displayNumber={NUMBER_HISTORY_ITEMS}
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

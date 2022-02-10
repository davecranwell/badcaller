import { useReducer, useEffect, useState } from 'react'

import { useSocketEffect } from '../../utils'

import Head from '../Head'
import Display from '../Display/Display'
import Status from '../Status/Status'
import History from '../History/History'
import HistoryList from '../History/HistoryList'
import ErrorBoundary from '../ErrorBoundary'

import { getUserCountry, updateUserCountry } from '../../services/country'

import { ReactComponent as Logo } from '../../badcaller-logo.svg'

import './App.css'

const NUMBER_HISTORY_ITEMS = 5

function callingStateReducer(state, action) {
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
  const [state, dispatch] = useReducer(callingStateReducer, {
    calls: [],
    ringing: false,
    number: {},
    rating: undefined,
  })

  const [connected, setConnected] = useState(false)
  const [userCountry, setUserCountry] = useState('GB')

  useSocketEffect({
    connect: () => setConnected(true),
    progress: (data) => dispatch({ type: 'progress', data }),
    result: (data) => dispatch({ type: 'result', data }),
  })

  useEffect(() => {
    getUserCountry().then((res) => {
      setUserCountry(res.country)
    })
  }, [])

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
          <Display
            ringing={ringing}
            numberObj={number}
            rating={rating}
            userCountry={userCountry}
          />

          <form className="countryform">
            <label htmlFor="country">Your country:</label>
            <select
              id="country"
              onChange={(event) => {
                updateUserCountry(event.target.value)
                setUserCountry(event.target.value)
              }}
              value={userCountry}
            >
              <option value="GB">United Kingdom</option>
              <option value="US">United States</option>
            </select>
          </form>

          <History connected={connected}>
            <ErrorBoundary
              message={'Unable to retrieve recent calls due to an error'}
            >
              <HistoryList
                displayCallCount={NUMBER_HISTORY_ITEMS}
                userCountry={userCountry}
                calls={calls}
                onFetchCalls={(data) => dispatch({ type: 'setCalls', data })}
              />
            </ErrorBoundary>
          </History>
        </main>
      </div>
    </>
  )
}

export default App

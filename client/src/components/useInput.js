import { useCallback, useReducer } from 'react'

function reducer(state, action) {
  if (!action) {
    const initialState = {}
    Object.keys(state).forEach((key) => {
      initialState[key] = ''
    })

    return initialState
  }

  return {
    ...state,
    [action.name]: action.value,
  }
}

export default function useInputs(defaultValues) {
  const [state, dispatch] = useReducer(reducer, defaultValues)
  const onChange = useCallback((e) => {
    dispatch({
      name: e.target.name,
      value: e.target.value,
    })
  }, [])
  const onReset = useCallback(() => {
    dispatch(null)
  }, [])

  return [state, dispatch, onChange, onReset]
}

import { useState } from 'react'

import Spinner from './Spinner/Spinner'

const IsLoadingHock = (Component) => {
  function HOC(props) {
    const [isLoading, setLoading] = useState(false)

    const setLoadingState = (isComponentLoading) => {
      setLoading(isComponentLoading)
    }

    return (
      <>
        {isLoading && <Spinner />}
        <Component {...props} setLoading={setLoadingState} />
      </>
    )
  }

  return HOC
}

export default IsLoadingHock

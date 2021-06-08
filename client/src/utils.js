import { useEffect } from 'react'

import socket from './services/socket'

export function useSocketEffect(eventHandlers) {
  useEffect(() => {
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      socket.on(event, handler)
    })

    return () => {
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        socket.off(event, handler)
      })
    }
  }, [eventHandlers])
}

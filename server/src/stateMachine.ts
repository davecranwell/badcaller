import {
  Machine,
  State,
  actions,
  assign,
  send,
  sendParent,
  interpret,
  spawn,
} from 'xstate'
import { Server } from 'socket.io'

import lookupNumber from './lib/lookupNumber'

type SerialModemContext = {
  number?: string
  rating?: string
  timeout: number
}

const { log } = actions

export default (io: Server) => {
  const serialModemMachine = Machine<SerialModemContext>(
    {
      id: 'serialModem',
      initial: 'idle',
      context: {
        number: undefined,
        rating: undefined,
        timeout: 5,
      },
      states: {
        idle: {
          entry: ['ioUpdate', log('Idle!')],
          on: {
            RING: 'ringing',
          },
        },
        ringing: {
          initial: 'awaitingNumber',
          entry: ['ioUpdate', log('Ringing!')],
          invoke: {
            id: 'ringTimeout',
            src: (context) => (cb) => {
              const timeout = setTimeout(() => {
                cb('NOT_RINGING')
              }, 1000 * context.timeout)

              return () => {
                clearInterval(timeout)
              }
            },
          },
          on: {
            RING: 'ringing',
            NOT_RINGING: 'idle',
          },
          states: {
            awaitingNumber: {
              entry: ['ioUpdate', log('Awaiting number!')],
              on: {
                NUMB: {
                  target: 'lookingUp',
                  actions: assign({
                    number: (context, event) => event.val,
                  }),
                },
              },
            },
            lookingUp: {
              entry: ['ioUpdate', log('Looking up!')],
              invoke: {
                id: 'lookupNumber',
                src: (context, event) => lookupNumber(context.number!),
                onDone: {
                  target: 'success',
                  actions: assign({ rating: (context, event) => event.data }),
                },
                onError: {
                  target: 'failure',
                  actions: assign({ rating: (context, event) => event.data }),
                },
              },
            },
            success: {
              entry: ['ioUpdate', log('Lookup succeeded!')],
            },
            failure: {
              entry: ['ioUpdate', log('Lookup failed!')],
            },
          },
        },
      },
    },
    {
      actions: {
        ioUpdate: (context, event) => {
          io.emit('state', context)
        },
      },
    }
  )

  setTimeout(() => {
    serialModemService.send({ type: 'RING', val: 'bar' })
  }, 2000)

  setTimeout(() => {
    serialModemService.send({ type: 'NUMB', val: '123' })
  }, 4000)

  // setTimeout(() => {
  //   serialModemMService.send('RING')
  // }, 4000)

  // setTimeout(() => {
  //   serialModemMService.send('RING')
  // }, 5000)

  // setTimeout(() => {
  //   serialModemMService.send('RING')
  // }, 6000)

  const serialModemService = interpret(serialModemMachine).start()

  return serialModemService
}

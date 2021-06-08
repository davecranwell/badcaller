import { Machine, DoneEventObject, assign, interpret } from 'xstate'
import { Server } from 'socket.io'
import SerialPort from 'serialport'

import lookupNumber from './lib/lookupNumber'
import makeLogger from './logger'

import { callsDB } from './database'

const logger = makeLogger('stateMachine')

type SerialModemContext = {
  ringing?: boolean
  number?: string
  rating?: string
  timeout: number
}

export type SerialEvent =
  | { type: 'RING' }
  | { type: 'NMBR'; data?: string }
  | { type: 'DATE'; data?: string }
  | { type: 'TIME'; data?: string }
  | { type: 'NOT_RINGING' }

export default ({ io, serialPort }: { io: Server; serialPort: SerialPort }) => {
  const serialModemMachine = Machine<SerialModemContext, any, SerialEvent>(
    {
      id: 'serialModem',
      initial: 'idle',
      context: {
        ringing: false,
        number: undefined,
        rating: undefined,
        timeout: 10,
      },
      states: {
        idle: {
          entry: ['socketIoProgress', 'log'],
          on: {
            RING: {
              target: 'ringing',
              actions: assign((context, event) => ({
                ringing: true,
              })),
            },
          },
        },
        ringing: {
          initial: 'awaitingNumber',
          entry: ['socketIoProgress', 'log'],
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
            RING: {
              target: 'ringing',
            },
            NOT_RINGING: {
              target: 'idle',
              actions: assign((context, event) => ({
                number: undefined,
                rating: undefined,
                ringing: false,
              })),
            },
          },
          states: {
            reset: {},
            awaitingNumber: {
              entry: ['socketIoProgress', 'log'],
              on: {
                NMBR: {
                  target: 'lookingUp',
                  actions: assign({
                    number: (context, event) => event.data,
                  }),
                },
              },
            },
            lookingUp: {
              entry: ['socketIoProgress', 'log'],
              invoke: {
                id: 'LOOKEDUP',
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
              entry: ['socketIoResult', 'log'],
              invoke: {
                src: 'saveCall',
              },
            },
            failure: {
              entry: ['socketIoProgress', 'log'],
            },
          },
        },
      },
    },
    {
      actions: {
        socketIoProgress: (context, event) => {
          io.emit('progress', context)
        },
        socketIoResult: (context, event) => {
          io.emit('result', context)
        },
        log: (context, event) => {
          const logitem = {
            context,
            event,
          }

          logger.trace(JSON.stringify(logitem))
        },
      },
      services: {
        saveCall: (context, event) => {
          return callsDB.asyncInsert({
            timestamp: Date.now(),
            number: context.number as string,
            rating: context.rating as string,
          })
        },
      },
    }
  )

  const serialModemService = interpret(serialModemMachine)

  return serialModemService
}

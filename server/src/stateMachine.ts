import { Machine, DoneEventObject, assign, interpret } from 'xstate'
import { Server } from 'socket.io'
import SerialPort from 'serialport'

import lookupNumber from './lib/lookupNumber'
import makeLogger from './logger'

const logger = makeLogger('stateMachine')

type SerialModemContext = {
  testNumber?: string
  rating?: string
  timeout: number
}

export type SerialEvent =
  | { type: 'RING' }
  | { type: 'NMBR'; data?: string }
  | { type: 'DATE'; data?: string }
  | { type: 'TIME'; data?: string }
  | { type: 'NOT_RINGING' }

const translateEvent = (event: DoneEventObject): SerialEvent => {
  const { type, data } = event
  return {
    type: type.includes('done.invoke.')
      ? <SerialEvent['type']>event.type.replace('done.invoke.', '')
      : <SerialEvent['type']>type,
    data,
  }
}

export default ({ io, serialPort }: { io: Server; serialPort: SerialPort }) => {
  const serialModemMachine = Machine<SerialModemContext, any, SerialEvent>(
    {
      id: 'serialModem',
      initial: 'idle',
      context: {
        testNumber: undefined,
        rating: undefined,
        timeout: 5,
      },
      states: {
        idle: {
          entry: ['socketIoUpdate', 'log'],
          on: {
            RING: 'ringing',
          },
        },
        ringing: {
          initial: 'awaitingNumber',
          entry: ['socketIoUpdate', 'log'],
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
            reset: {},
            awaitingNumber: {
              entry: ['socketIoUpdate', 'log'],
              on: {
                NMBR: {
                  target: 'lookingUp',
                  actions: assign({
                    testNumber: (context, event) => event.data,
                  }),
                },
              },
            },
            lookingUp: {
              entry: ['socketIoUpdate', 'log'],
              invoke: {
                id: 'LOOKEDUP',
                src: (context, event) => lookupNumber(context.testNumber!),
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
              entry: ['socketIoUpdate', 'log'],
            },
            failure: {
              entry: ['socketIoUpdate', 'log'],
            },
          },
        },
      },
    },
    {
      actions: {
        socketIoUpdate: (context, event) => {
          io.emit('message', translateEvent(event))
        },
        log: (context, event) => {
          const logitem = {
            context,
            event,
          }

          logger.trace(JSON.stringify(logitem))
        },
      },
    }
  )

  const serialModemService = interpret(serialModemMachine)

  return serialModemService
}

import {
  Machine,
  DoneEventObject,
  AnyEventObject,
  assign,
  interpret,
} from 'xstate'
import { Server } from 'socket.io'
import SerialPort from 'serialport'

import lookupNumber from './lib/lookupNumber'
import makeLogger from './logger'

const logger = makeLogger('stateMachine')

export interface StateMachineEventData extends AnyEventObject {
  type: string
  data?: string
}

type SerialModemContext = {
  number?: string
  rating?: string
  timeout: number
}

const translateEvent = (event: DoneEventObject): StateMachineEventData => {
  const { type, data } = event
  return {
    type: type.includes('done.invoke.')
      ? event.type.replace('done.invoke.', '')
      : type,
    data,
  }
}

export default ({ io, serialPort }: { io: Server; serialPort: SerialPort }) => {
  const serialModemMachine = Machine<
    SerialModemContext,
    any,
    StateMachineEventData
  >(
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
                NUMB: {
                  target: 'lookingUp',
                  actions: assign({
                    number: (context, event) => event.data,
                  }),
                },
              },
            },
            lookingUp: {
              entry: ['socketIoUpdate', 'log'],
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

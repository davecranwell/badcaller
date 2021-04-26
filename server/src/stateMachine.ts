import {
  Machine,
  DoneEventObject,
  State,
  actions,
  assign,
  send,
  sendParent,
  interpret,
  spawn,
  StateMachine,
  AnyEventObject,
} from 'xstate'
import { Server } from 'socket.io'
import SerialPort from 'serialport'

import lookupNumber from './lib/lookupNumber'

type SerialModemContext = {
  number?: string
  rating?: string
  timeout: number
}

const { log } = actions

const translateEvent = (event: DoneEventObject) => {
  const { type, data } = event
  return {
    type: type.includes('done.invoke.')
      ? event.type.replace('done.invoke.', '')
      : type,
    data,
  }
}

export default ({ io, serialPort }: { io: Server; serialPort: SerialPort }) => {
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
          entry: ['socketIoUpdate', log('Idle!')],
          on: {
            RING: 'ringing',
          },
        },
        ringing: {
          initial: 'awaitingNumber',
          entry: ['socketIoUpdate', log('Ringing!')],
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
              entry: ['socketIoUpdate', log('Awaiting number!')],
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
              entry: ['socketIoUpdate', log('Looking up!')],
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
              entry: ['socketIoUpdate', log('Lookup succeeded!')],
            },
            failure: {
              entry: ['socketIoUpdate', log('Lookup failed!')],
            },
          },
        },
      },
    },
    {
      actions: {
        socketIoUpdate: (context, event) => {
          const newEvent = translateEvent(event)
          console.log(newEvent)
          io.emit('message', newEvent)
        },
      },
    }
  )

  setTimeout(() => {
    serialModemService.send({ type: 'RING', data: 'bar' })
  }, 2000)

  setTimeout(() => {
    serialModemService.send({ type: 'NUMB', data: '123' })
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

import { exec } from 'child_process'
import { Machine, DoneInvokeEvent, assign, interpret, EventData } from 'xstate'
import { Application } from 'express'
import { Server } from 'socket.io'
import SerialPort from 'serialport'
import parsePhoneNumber, {
  CountryCode,
  E164Number,
  NationalNumber,
  PhoneNumber,
} from 'libphonenumber-js'

import formatNumber from './lib/formatNumber'
import lookupNumber, { Rating } from './lib/lookupNumber'
import makeLogger from './logger'

import { callsDB } from './database'
import { NumberForDB } from './types'

const logger = makeLogger('stateMachine')

type SerialModemContext = {
  ringing?: boolean
  number?: NumberForDB
  rating?: string
  timeout: number
  name?: string
}

export type SerialEvent =
  | { type: 'RING' }
  | { type: 'NMBR'; data?: string }
  | { type: 'DATE'; data?: string }
  | { type: 'TIME'; data?: string }
  | { type: 'NOT_RINGING' }

export default ({
  app,
  io,
  serialPort,
}: {
  app: Application
  io: Server
  serialPort: SerialPort
}) => {
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
          entry: ['screensaverOn', 'socketIoProgress', 'log'],
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
          entry: ['screensaverOff', 'socketIoProgress', 'log'],
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
            awaitingNumber: {
              entry: ['socketIoProgress', 'log'],
              on: {
                NMBR: {
                  target: 'formatting',
                },
              },
            },
            formatting: {
              invoke: {
                src: async (context, event) => {
                  if (event.type === 'NMBR') {
                    return formatNumber(event.data!, app.get('country'))
                  }
                },
                onDone: {
                  target: 'lookingUp',
                  actions: assign({ number: (context, event) => event.data }),
                },
                onError: {
                  target: 'failure',
                  actions: assign({ number: (context, event) => event.data }),
                },
              },
            },
            lookingUp: {
              entry: ['socketIoProgress', 'log'],
              invoke: {
                id: 'LOOKEDUP',
                src: (context, event) =>
                  lookupNumber((event as DoneInvokeEvent<NumberForDB>).data!),
                onDone: {
                  target: 'success',
                  actions: assign({
                    rating: (context, event: DoneInvokeEvent<Rating>) =>
                      event.data,
                  }),
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
        screensaverOn: (context, event) => {
          exec(
            'export DISPLAY=:0; xset s 60; xset s blank',
            (err, stdout, stderr) => {
              if (err) {
                logger.error(`exec error: ${err}`)
                return
              }
              logger.trace(`stdout: ${stdout}`)
            }
          )
        },
        screensaveOff: (ccontext, event) => {
          exec('export DISPLAY=:0; xset s reset', (err, stdout, stderr) => {
            if (err) {
              logger.error(`exec error: ${err}`)
              return
            }
            logger.trace(`stdout: ${stdout}`)
          })
        },
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
        saveCall: (context, event) =>
          callsDB.asyncInsert({
            timestamp: Date.now(),
            rating: context.rating as string,
            ...context.number,
          }),
      },
    }
  )

  const serialModemService = interpret(serialModemMachine)

  return serialModemService
}

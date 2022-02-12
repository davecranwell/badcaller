import { Machine, DoneEventObject, assign, interpret } from 'xstate'
import { Application } from 'express'
import { Server } from 'socket.io'
import SerialPort from 'serialport'
import parsePhoneNumber, {
  CountryCode,
  E164Number,
  NationalNumber,
  PhoneNumber,
} from 'libphonenumber-js'

import lookupNumber from './lib/lookupNumber'
import makeLogger from './logger'

import { callsDB, contactDB } from './database'

const logger = makeLogger('stateMachine')

export interface NumberForDB {
  number?: E164Number | string
  country?: CountryCode
  national?: NationalNumber
  international?: E164Number
  name?: string
}

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
                  target: 'formatting',
                },
              },
            },
            formatting: {
              invoke: {
                src: 'formatNumber',
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
                src: (context, event) => lookupNumber(context?.number!.number!),
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
        formatNumber: async (context, event) => {
          let number: string

          if (event.type !== 'NMBR') return

          number = event.data!

          const parsedNumber = parsePhoneNumber(number, app.get('country'))

          if (!parsedNumber || !parsedNumber.isValid()) {
            return {
              number,
              country: undefined,
              national: undefined,
              international: undefined,
            }
          }

          const contact = await contactDB.asyncFindOne({
            number: parsedNumber.number,
          })

          return {
            name: contact.name,
            number: parsedNumber.number,
            country: parsedNumber.country,
            national: parsedNumber.formatNational(),
            international: parsedNumber.formatInternational(),
          }
        },

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

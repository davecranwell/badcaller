import config from 'config'
import { Server as SocketServer } from 'socket.io'

import serverPackage from '../package.json'
import clientPackage from '../../client/package.json'

import app from './app'
import makeLogger from './logger'
import makeSerialConnection from './lib/serialInterface'

import makeStateMachine, { SerialEvent } from './stateMachine'

const logger = makeLogger('index')

const port = config.get('port')
const express = app.listen(port)

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p)
  })
  .on('uncaughtException', (err) => {
    console.error(err, 'Uncaught Exception thrown')
    process.exit(1)
  })

const io = new SocketServer(express, {
  cors: { origin: 'http://localhost:3000' },
})

io.on('connection', (socket) => {
  logger.info('Client socket connected')
  io.emit('versions', {
    client: clientPackage.version,
    server: serverPackage.version,
  })
  io.emit('progress', {
    ...stateMachine.state.context,
  })
})

// send serial port events to statemachine
const serialPort = makeSerialConnection({
  onData: async (data: SerialEvent) => {
    stateMachine.send(data)
  },
})

// start state machine
const stateMachine = makeStateMachine({ app, io, serialPort }).start()

express.on('listening', async () => {
  logger.info('Started server')

  try {
    serialPort.open()
  } catch (e: any) {
    logger.error(e)
  }
})

// Fake effects for development only
if (process.env.NODE_ENV !== 'production') {
  setTimeout(() => {
    stateMachine.send({ type: 'RING' })
  }, 2000)

  setTimeout(() => {
    stateMachine.send({ type: 'RING' })
  }, 4000)

  setTimeout(() => {
    stateMachine.send({ type: 'RING' })
  }, 6000)

  setTimeout(() => {
    stateMachine.send({ type: 'NMBR', data: '01234567890' })
  }, 6500)

  setTimeout(() => {
    stateMachine.send({ type: 'RING' })
  }, 8000)
}

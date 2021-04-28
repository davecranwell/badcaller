import config from 'config'
import { Server as SocketServer } from 'socket.io'

import app from './app'
import makeLogger from './logger'
import makeSerialConnection from './lib/serialInterface'

import makeStateMachine, { StateMachineEventData } from './stateMachine'

const logger = makeLogger('index')

const port = config.get('port')
const express = app.listen(port)

const io = new SocketServer(express, {
  cors: { origin: 'http://localhost:3000' },
})

io.on('connection', (socket) => {
  logger.info('Client socket connected')
  io.emit('currentstate', stateMachine.state.context)
  socket.emit('hello', 'world')
})

// send serial port events to statemachine
const serialPort = makeSerialConnection({
  onData: async (data: string) => {
    stateMachine.send(data)
  },
})

// start state machine
const stateMachine = makeStateMachine({ io, serialPort }).start()

express.on('listening', async () => {
  logger.info('Started server')

  try {
    serialPort.open()
  } catch (e) {
    logger.error(e)
  }
})

// Fake effects for development only
if (process.env.NODE_ENV !== 'production') {
  setTimeout(() => {
    stateMachine.send({ type: 'RING', data: 'bar' })
  }, 2000)

  setTimeout(() => {
    stateMachine.send('')
  }, 3000)

  setTimeout(() => {
    stateMachine.send('')
  }, 4000)

  setTimeout(() => {
    stateMachine.send({ type: 'RING', data: 'bar' })
  }, 5000)

  setTimeout(() => {
    stateMachine.send({ type: 'NUMB', data: '123' })
  }, 6000)
}

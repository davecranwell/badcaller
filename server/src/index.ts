import config from 'config'
import { Server as SocketServer } from 'socket.io'
import { Event, AnyEventObject } from 'xstate'

import app from './app'
import makeLogger from './logger'
import makeSerialConnection from './lib/serialInterface'

import makeStateMachine from './stateMachine'

const logger = makeLogger('index')

const port = config.get('port')
const express = app.listen(port)

const io = new SocketServer(express)
const stateMachine = makeStateMachine(io)

io.on('connection', (socket) => {
  logger.info('Client socket connected')
  console.log(stateMachine.state)
  io.emit('currentstate', stateMachine.state)
})

interface StateMachineEventData extends AnyEventObject {
  type: string
  val?: string
}

express.on('listening', async () => {
  logger.info('Started server')

  const serialPort = makeSerialConnection({
    onData: async (data: string) => {
      // format serial data nicer
      const stateData: StateMachineEventData = data.includes('=')
        ? {
            type: data.split('=').shift()!.trim(),
            val: data.split('=').pop()?.trim(),
          }
        : { type: data.trim() }

      stateMachine.send(stateData)
    },
  })

  try {
    serialPort.open()
  } catch (e) {
    logger.error(e)
  }
})

import config from 'config'
import { Server as SocketServer } from 'socket.io'

import app from './app'
import makeLogger from './logger'
import makeSerialConnection from './lib/serialInterface'
import lookupNumber from './lib/lookupNumber'

const logger = makeLogger('index')
const port = config.get('port')

const express = app.listen(port)

const io = new SocketServer(express, {
  cors: { origin: 'http://localhost:3000' },
}).on('connection', (socket) => {
  logger.info('Client socket connected')
})

express.on('listening', async () => {
  logger.info('Started server')

  const serialPort = makeSerialConnection({
    onData: async (data: string) => {
      if (data.indexOf('NMBR=') > -1) {
        const number: string = data.split('=').pop()?.trim() as string

        //const rating = await lookupNumber(number);

        io.emit('/caller', {
          number,
          rating: 'dangerous',
        })
      }

      return data
    },
  })

  try {
    serialPort.open()
  } catch (e) {
    logger.error(e)
  }
})

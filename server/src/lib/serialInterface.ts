import config from 'config'
import SerialPort from 'serialport'
import Readline from '@serialport/parser-readline'
import MockBinding from '@serialport/binding-mock'

import { SerialEvent } from '../stateMachine'
import makeLogger from '../logger'

const logger = makeLogger('serialInterface')

const portName = config.get('serialPort') as string

if (process.env.NODE_ENV === 'development') {
  SerialPort.Binding = MockBinding
  MockBinding.createPort(portName, { echo: true, record: true })
}

const serialPort = new SerialPort(portName, { autoOpen: false })
const parser = serialPort.pipe(new Readline({ delimiter: '\n' }))

export default ({ onData }: { onData: Function }) => {
  serialPort.on('open', () => {
    logger.info(`Opened serial port ${portName}`)

    serialPort.write('AT+VCID=1\r', (error) => {
      if (error) {
        return logger.error('Error on write: ', error.message)
      }
      logger.info('Enabled CallerID')
    })
  })

  parser.on('data', (data: string): void => {
    if (data === '\r' || !data.trim().length) return

    const type = data.split('=').shift()!.trim()
    const serialData = data.split('=').pop()?.trim()

    const newData: SerialEvent = data.includes('=')
      ? { type: <SerialEvent['type']>type, data: serialData }
      : { type: <SerialEvent['type']>type }

    onData(newData)
  })

  return serialPort
}

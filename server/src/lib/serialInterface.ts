import config from 'config'
import SerialPort from 'serialport'
import Readline from '@serialport/parser-readline'
import MockBinding from '@serialport/binding-mock'

import makeLogger from '../logger'

const logger = makeLogger('serialInterface')

const portName = config.get('serialPort') as string

if (process.env.NODE_ENV === 'development') {
  SerialPort.Binding = MockBinding
  MockBinding.createPort(portName, { echo: true, record: true })

  // @ts-ignore
  setTimeout(() => serialPort.binding.emitData('\nNMBR=1\n'), 500)
}

const serialPort = new SerialPort(portName, { autoOpen: false })
const parser = serialPort.pipe(new Readline({ delimiter: '\n' }))

export default ({ onData }: any) => {
  serialPort.on('open', () => {
    logger.info(`Opened serial port ${portName}`)

    serialPort.write('AT+VCID=1\r', (error) => {
      if (error) {
        return logger.error('Error on write: ', error.message)
      }
      logger.info('Enabled CallerID')
    })
  })
  parser.on('data', onData)

  return serialPort
}

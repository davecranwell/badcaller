import config from 'config'
import pino, { Logger } from 'pino'

const logger = pino({
  level: config.get('loggingLevel'),
  prettyPrint: true,
})

export default (name: string): Logger => {
  return logger.child({ name })
}

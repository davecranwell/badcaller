import config from 'config'

import app from './app'
import makeLogger from 'badcaller-common-lib/logger'

const logger = makeLogger('index')

const start = async () => {
  if (!config.get('jwtSecret')) {
    throw new Error('JWT_SECRET must be defined in env')
  }

  const port = config.get('port')
  app.listen(port, () => {
    logger.info(`Listening on port ${port}`)
  })
}

start()

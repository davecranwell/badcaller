import config from 'config'
import mongoose from 'mongoose'

import app from './app'
import makeLogger from './logger'

const logger = makeLogger('index')

const start = async () => {
  if (!config.get('jwtSecret')) {
    throw new Error('JWT_SECRET must be defined in env')
  }

  try {
    const { url, config: mongoConfig } = config.get('mongodb')
    await mongoose.connect(url, mongoConfig)
    logger.info(`Connected to MongoDb ${url}`)
  } catch (err) {
    logger.error(err)
  }

  const port = config.get('port')
  app.listen(port, () => {
    logger.info(`Listening on port ${port}`)
  })
}

start()

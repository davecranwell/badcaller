import AsyncNedb from 'nedb-async'
import config from 'config'

import { NumberForDB } from './stateMachine'

interface Call extends NumberForDB {
  timestamp: number
  rating: string
}

interface Country {
  _id: string
  value: string
}

export const callsDB = new AsyncNedb<Call>({
  filename: `${config.get('dbDir')}/calls.db`,
  autoload: true,
})

export const countryDB = new AsyncNedb<Country>({
  filename: `${config.get('dbDir')}/country.db`,
  autoload: true,
})

callsDB.ensureIndex({ fieldName: 'timestamp', expireAfterSeconds: 108000 }) // 30 day expiry
callsDB.ensureIndex({ fieldName: 'number' })

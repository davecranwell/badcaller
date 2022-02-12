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

interface Contact {
  number: string
  name: string
}

export const callsDB = new AsyncNedb<Call>({
  filename: `${config.get('dbDir')}/calls.db`,
  autoload: true,
})

callsDB.ensureIndex({ fieldName: 'timestamp', expireAfterSeconds: 108000 }) // 30 day expiry
callsDB.ensureIndex({ fieldName: 'number' })

export const countryDB = new AsyncNedb<Country>({
  filename: `${config.get('dbDir')}/country.db`,
  autoload: true,
})

export const contactDB = new AsyncNedb<Contact>({
  filename: `${config.get('dbDir')}/contact.db`,
  autoload: true,
})

contactDB.ensureIndex({ fieldName: 'number' })

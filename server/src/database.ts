import AsyncNedb from 'nedb-async'

interface Call {
  timestamp: number
  number: string
  rating: string
}

export const callsDB = new AsyncNedb<Call>({
  filename: './calls.db',
  autoload: true,
})

callsDB.ensureIndex({ fieldName: 'timestamp', expireAfterSeconds: 108000 }) // 30 day expiry
callsDB.ensureIndex({ fieldName: 'number' })

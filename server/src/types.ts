import { CountryCode, E164Number, NationalNumber } from 'libphonenumber-js'

export interface NumberForDB {
  number?: E164Number | string
  country?: CountryCode
  national?: NationalNumber
  international?: E164Number
  name?: string
}

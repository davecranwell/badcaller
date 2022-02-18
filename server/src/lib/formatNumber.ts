import parsePhoneNumber, { CountryCode } from 'libphonenumber-js'

import { NumberForDB } from '../types'
import { contactDB } from '../database'

export default async (
  number: string,
  userCountry: CountryCode
): Promise<NumberForDB | undefined> => {
  const parsedNumber = parsePhoneNumber(number, userCountry)

  if (!parsedNumber?.number || !parsedNumber.isValid()) {
    return {
      number,
      country: undefined,
      national: undefined,
      international: undefined,
    }
  }

  const contact = await contactDB.asyncFindOne({
    number: parsedNumber.number,
  })

  return {
    name: contact?.name,
    number: parsedNumber.number,
    country: parsedNumber.country,
    national: parsedNumber.formatNational(),
    international: parsedNumber.formatInternational(),
  }
}

import { mocked } from 'jest-mock'

import { contactDB } from '../database'
import formatNumber from './formatNumber'

jest.mock('../database')

const mockedContactDB = mocked(contactDB, true)

beforeEach(() => {
  jest.clearAllMocks()
})

it('Formats an number into the expected shape', () => {
  return expect(formatNumber('01234567890', 'GB')).resolves.toEqual({
    country: 'GB',
    international: '+44 1234 567890',
    name: undefined,
    national: '01234 567890',
    number: '+441234567890',
  })
})

it('Returns a basic shape when number is phoney', () => {
  return expect(formatNumber('12345', 'GB')).resolves.toEqual({
    country: undefined,
    international: undefined,
    name: undefined,
    national: undefined,
    number: '12345',
  })
})

it('Returns a number with a contact name when provided', async () => {
  mockedContactDB.asyncFindOne.mockResolvedValue({
    name: 'Joseph Bloggs',
    number: '01234567890',
  })

  return expect(formatNumber('01234567890', 'GB')).resolves.toEqual({
    country: 'GB',
    international: '+44 1234 567890',
    name: 'Joseph Bloggs',
    national: '01234 567890',
    number: '+441234567890',
  })
})

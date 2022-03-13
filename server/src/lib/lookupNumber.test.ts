import mockAxios from 'jest-mock-axios'

import lookupNumber from './lookupNumber'

afterEach(() => {
  mockAxios.reset()
})

it('Sends the right part of a properly formatted number', () => {
  const number = {
    number: '+44 12345 67890',
    national: '01234 567890',
    international: '+44 12345 67890',
  }

  const result = lookupNumber(number)

  return expect(mockAxios.get).toHaveBeenCalledWith(
    `https://who-called.co.uk/Number/01234567890`
  )
})

it('Sends the default part of a improperly formatted number without the plus symbol', () => {
  const number = {
    number: '+441234567890',
  }

  lookupNumber(number)
  return expect(mockAxios.get).toHaveBeenCalledWith(
    `https://who-called.co.uk/Number/441234567890`
  )
})

it('Returns neutral if no information found', () => {
  const number = {
    number: '+441234567890',
  }

  const res = lookupNumber(number)

  mockAxios.mockResponse({ data: '<html>empty</html>' })

  return expect(res).resolves.toEqual('neutral')
})

it('Parses the correct response from simulated HTML', () => {
  const number = {
    number: '+441234567890',
  }

  const res = lookupNumber(number)

  mockAxios.mockResponse({
    data:
      '<html><div class="numberDetails"><div class="dataColumn"><p>testtest</p></div></div></html>',
  })

  return expect(res).resolves.toEqual('testtest')
})

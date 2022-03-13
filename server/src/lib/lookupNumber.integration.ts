import axios from 'axios'

import lookupNumber from './lookupNumber'

it.only('Sends the right part of a properly formatted number', async () => {
  const number = {
    number: '+441630814006',
    national: '01630 814006',
    international: '+44 1630 814006',
  }

  const result = await lookupNumber(number)

  return expect(axios.get).toHaveBeenCalledWith(
    `https://who-called.co.uk/Number/01630814006`
  )
})

it('Sends the default part of a improperly formatted number without the plus symbol', async () => {
  const number = {
    number: '+441630814006',
  }

  await lookupNumber(number)

  return expect(axios.get).toHaveBeenCalledWith(
    `https://who-called.co.uk/Number/441630814006`
  )
})

it('Returns neutral if no information found', async () => {
  const number = {
    number: '+441234567890',
  }

  const res = await lookupNumber(number)

  return expect(res).resolves.toEqual('neutral')
})

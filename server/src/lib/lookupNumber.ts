import axios from 'axios'
import cheerio from 'cheerio'

import { NumberForDB } from '../types'

const delay = (ms: number): Promise<any> =>
  new Promise((resolve) => setTimeout(resolve, ms))

const ratings = [
  'dangerous',
  'negative',
  'harassing',
  'neutral',
  'safe',
] as const

// convert ratings array to union type
export type Rating = typeof ratings[number]

export default async (numberObj: NumberForDB): Promise<Rating | false> => {
  try {
    const { number, national } = numberObj

    let rating: Rating

    if (['production', 'test'].includes(process.env.NODE_ENV as string)) {
      const numberToUse = (national || number)?.replace(/[^0-9]/g, '')

      const ret = await axios.get(
        `https://who-called.co.uk/Number/${numberToUse}`
      )
      const $ = cheerio.load(ret.data)
      rating = $('.numberDetails .dataColumn')
        .first()
        .text()
        .toLowerCase()
        .trim() as Rating
    } else {
      rating = ratings[Math.floor(Math.random() * ratings.length)]
      await delay(1000)
    }

    if (!rating.length) return 'neutral'

    return rating
  } catch (e) {
    return false
  }
}

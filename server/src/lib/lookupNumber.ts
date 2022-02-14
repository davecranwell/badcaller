import axios, { AxiosResponse } from 'axios'
import cheerio from 'cheerio'
import { E164Number } from 'libphonenumber-js'

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

export default async (number: string | E164Number): Promise<Rating | false> => {
  try {
    let data
    let rating: Rating

    if (process.env.NODE_ENV === 'production') {
      const ret = await axios.get(`https://who-called.co.uk/Number/${number}`)
      data = ret.data

      const $ = cheerio.load(data)
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

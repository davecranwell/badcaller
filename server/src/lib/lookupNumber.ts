import axios, { AxiosResponse } from 'axios'
import cheerio from 'cheerio'

const delay = (ms: number): Promise<any> =>
  new Promise((resolve) => setTimeout(resolve, ms))

export default async (number: string): Promise<string | false> => {
  try {
    let data
    let rating

    if (process.env.NODE_ENV !== 'development') {
      const ret = await axios.get(`https://who-called.co.uk/Number/${number}`)
      data = ret.data

      const $ = cheerio.load(data)
      rating = $('.numberDetails .dataColumn')
        .first()
        .text()
        .toLowerCase()
        .trim()
    } else {
      const ratings = ['dangerous', 'negative', 'harassing', 'neutral', 'safe']

      rating = ratings[Math.floor(Math.random() * ratings.length)]
      await delay(1000)
    }

    if (!rating.length) return false

    return rating
  } catch (e) {
    return false
  }
}

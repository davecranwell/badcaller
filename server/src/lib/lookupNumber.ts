import axios, { AxiosResponse } from 'axios'
import cheerio from 'cheerio'

export default async (number: string) => {
  try {
    const { data } = await axios.get(
      `https://who-called.co.uk/Number/${number}`
    )

    const $ = cheerio.load(data)
    const rating = $('.numberDetails .dataColumn').text()

    if (!rating.length) return false

    return rating
  } catch (e) {
    return false
  }
}

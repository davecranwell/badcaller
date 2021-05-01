import axios, { AxiosResponse } from 'axios'
import cheerio from 'cheerio'

const delay = (ms: number): Promise<any> =>
  new Promise((resolve) => setTimeout(resolve, ms))

export default async (number: string): Promise<string | false> => {
  try {
    let data

    if (process.env.NODE_ENV !== 'development') {
      const ret = await axios.get(`https://who-called.co.uk/Number/${number}`)
      data = ret.data
    } else {
      data = `<html>
        <div class="numberDetails">
          <div class="dataColumn">Dangerous</div>
          <div class="dataColumn">123</div>
          <div class="dataColumn">ABC</div>
        </div>
      </html>`

      await delay(1000)
    }

    const $ = cheerio.load(data)
    const rating = $('.numberDetails .dataColumn').first().text().toLowerCase()

    if (!rating.length) return false

    return rating
  } catch (e) {
    return false
  }
}

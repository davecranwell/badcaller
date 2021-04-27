import axios, { AxiosResponse } from 'axios'
import cheerio from 'cheerio'

export default async (number: string) => {
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
    }

    const $ = cheerio.load(data)
    const rating = $('.numberDetails .dataColumn').first().text().toLowerCase()

    if (!rating.length) return false

    return rating
  } catch (e) {
    return false
  }
}

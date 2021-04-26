import axios, { AxiosResponse } from 'axios'
import cheerio from 'cheerio'

export default async (number: string) => {
  try {
    // const { data } = await axios.get(
    //   `https://who-called.co.uk/Number/${number}`
    // )
    const data = `<html>
      <div class="numberDetails">
        <div class="dataColumn">Dangerous</div>
      </div>
    </html>`

    const $ = cheerio.load(data)
    const rating = $('.numberDetails .dataColumn').text().toLowerCase()

    if (!rating.length) return false

    return rating
  } catch (e) {
    return false
  }
}

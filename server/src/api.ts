import express, { Request, Response } from 'express'
import { CountryCode } from 'libphonenumber-js'

import { callsDB, countryDB, contactDB } from './database'

const router = express.Router()

interface CallQuery {
  $sort?: object
  $limit?: number
}

interface CountryData {
  country: CountryCode
}

interface ContactData {
  number: string
  name: string
}

router.get('/calls', (req, res) => {
  const { query }: { query: CallQuery } = req
  const { $sort, $limit, ...generalQuery } = query

  const search = callsDB.find(generalQuery).sort($sort)

  if ($limit) search.limit($limit)

  // Map flat DB into array of objects with number details
  // collected in 'number' property
  search.exec((err, docs) => {
    Promise.all(
      docs.map(async (doc) => {
        // Find associated contacts
        const contact = await contactDB.asyncFindOne({ number: doc.number })

        return {
          ...doc,
          number: {
            name: contact?.name,
            number: doc.number,
            international: doc.international,
            national: doc.national,
            country: doc.country,
          },
        }
      })
    ).then((callsWithContacts) => {
      return res.json(callsWithContacts)
    })
  })
})

router.post('/country', (req, res) => {
  const { body }: { body: CountryData } = req
  const { country } = body

  // Remove old value first. Upsert functionality seems confusing or broken
  countryDB.remove({ _id: 'country' })

  countryDB.insert({ _id: 'country', value: country }, (err, newDocs) => {
    if (err) return res.json({ error: err })

    req.app.set('country', country)
    return res.json(newDocs)
  })
})

router.get('/country', (req, res) => {
  countryDB.findOne({ _id: 'country' }, (err, doc) => {
    return res.json({
      country: doc?.value,
    })
  })
})

router.post('/contact', (req, res) => {
  const { body }: { body: ContactData } = req
  const { number, name } = body

  contactDB.update(
    { number },
    { name, number },
    { upsert: true },
    (err, numReplaced) => {
      if (err) return res.json({ error: err })

      return res.json(numReplaced)
    }
  )
})

router.get('/contact', (req, res) => {
  const { query } = req
  const { number } = query

  contactDB.findOne({ number }, (err, docs) => {
    if (err) return res.json({ error: err })

    return res.json(docs)
  })
})

export default router

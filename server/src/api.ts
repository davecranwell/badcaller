import express, { Request, Response } from 'express'

import { callsDB, countryDB } from './database'

const router = express.Router()

interface CallQuery {
  $sort?: object
  $limit?: number
}

interface CountryData {
  value: string
}

router.get('/calls', (req, res) => {
  const { query }: { query: CallQuery } = req
  const { $sort, $limit, ...generalQuery } = query

  const search = callsDB.find(generalQuery).sort($sort)

  if ($limit) search.limit($limit)

  search.exec((err, docs) => {
    return res.json(docs)
  })
})

router.post('/country', (req, res) => {
  const { body }: { body: CountryData } = req
  const { value } = body

  // Remove old value first. Upsert functionality seems confusing or broken
  countryDB.remove({ _id: 'country' }, (err, numRemoved) => {
    console.log({ numRemoved })
  })

  countryDB.insert({ _id: 'country', value }, (err, newDocs) => {
    if (err) return res.json({ error: err })

    req.app.set('country', value)
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

export default router

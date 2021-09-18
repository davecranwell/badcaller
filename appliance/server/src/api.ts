import express, { Request, Response } from 'express'

import { callsDB } from './database'

const router = express.Router()

interface CallQuery {
  $sort?: object
  $limit?: number
}

router.get('/calls', (req: Request, res: Response) => {
  const { query }: { query: CallQuery } = req
  const { $sort, $limit, ...generalQuery } = query

  const search = callsDB.find(generalQuery).sort($sort)

  if ($limit) search.limit($limit)

  search.exec((err, docs) => {
    return res.json(docs)
  })
})

export default router

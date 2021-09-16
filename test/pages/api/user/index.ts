// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { body, validationResult } from 'express-validator'

import applyMiddleware from '../../../middleware/apply-middleware'
import validateMiddleware from '../../../middleware/validate-middleware'

type Data = {
  message: string
  data?: object
}

const validatePost = applyMiddleware(
  validateMiddleware(
    [
      body('number')
        .isString()
        .trim()
        .matches(/^[0-9]*$/)
        .isLength({ min: 5, max: 20 })
        .withMessage(`Field 'number' is missing or invalid`),
      body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage(`Field 'rating' is missing or invalid`),
    ],
    validationResult
  )
)

const post = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const {
    body: { number },
  } = req

  await validatePost(req, res)

  return res.json({ message: 'success', data: { number } })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'POST':
      return await post(req, res)
    default:
      return res.status(404).json({ message: 'Not found' })
  }
}

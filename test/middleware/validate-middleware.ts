import type { NextApiRequest, NextApiResponse } from 'next'
import { NextFunction } from 'express'
import {
  ResultFactory,
  ValidationChain,
  ValidationError,
} from 'express-validator'

export default function validateMiddleware(
  validations: ValidationChain[],
  validationResult: ResultFactory<ValidationError>
) {
  return async (
    req: NextApiRequest,
    res: NextApiResponse,
    next: NextFunction
  ) => {
    await Promise.all(validations.map((validation) => validation.run(req)))

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    return next()
  }
}

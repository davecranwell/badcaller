import { Request, Response, NextFunction } from 'express'
import { NotAuthorisedError } from '../errors/not-authorised'

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    throw new NotAuthorisedError()
  }

  next()
}

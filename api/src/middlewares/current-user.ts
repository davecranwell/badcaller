import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import config from 'config'

interface UserPayload {
  id: string
  email: string
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next()
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      config.get('jwtSecret')
    ) as UserPayload
    req.user = payload
  } catch (err) {}

  next()
}

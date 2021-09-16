import type { NextApiRequest, NextApiResponse } from 'next'
import { NextFunction } from 'express'
import { getSession } from 'next-auth/client'

export default async function validateSession(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextFunction
) {
  const session = await getSession({ req })
  if (!session)
    return res.status(401).json({ errors: 'You must be logged in to do that' })

  return next()
}

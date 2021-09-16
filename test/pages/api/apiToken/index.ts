// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { randomBytes } from 'crypto'
import bcrypt from 'bcrypt'

import prisma from '../../../lib/prisma'
import applyMiddleware from '../../../middleware/apply-middleware'
import validateSession from '../../../middleware/validate-session'

type Data = {
  message?: string
  data?: object
  errors?: string | string[]
}

const hasSession = applyMiddleware(validateSession)

const post = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await hasSession(req, res)

  const session = await getSession({ req })
  const uid = await randomBytes(20).toString('hex')
  const secret = await randomBytes(20).toString('hex')
  const hashedSecret = await bcrypt.hash(secret, 10)

  await prisma.apiToken.create({
    data: {
      guid: uid,
      tokenHash: hashedSecret,
      user: {
        connect: { id: session?.user?.id },
      },
    },
  })

  return res.json({
    message: 'success',
    data: { key: `${uid}.${secret}` },
  })
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

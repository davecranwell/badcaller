import { Request, Response, Router } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import config from 'config'

import { validateRequest } from 'badcaller-common-lib/middlewares/validate-request'
import { BadRequestError } from 'badcaller-common-lib/errors/bad-request'
import makeLogger from 'badcaller-common-lib/logger'

import { Password } from '../util/password'

const logger = makeLogger('index')
// import { User } from '../models/user'

export default (router: Router) =>
  router.post(
    '/signin',
    [
      body('email').isEmail().withMessage('Email must be valid'),
      body('password')
        .trim()
        .notEmpty()
        .withMessage('You must supply a password'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const { email, password } = req.body

      // const existingUser = await User.findOne({ email })
      // if (!existingUser) {
      //   throw new BadRequestError('Invalid credentials')
      // }

      // const passwordsMatch = await Password.compare(
      //   existingUser.password,
      //   password
      // )
      // if (!passwordsMatch) {
      //   throw new BadRequestError('Invalid Credentials')
      // }

      const existingUser = {
        id: 'abc123',
        email: 'foo@bar.com',
      }

      // Generate JWT
      const userJwt = jwt.sign(
        {
          id: existingUser.id,
          email: existingUser.email,
        },
        config.get('jwtSecret')
      )

      // Store it on session object
      req.session = {
        jwt: userJwt,
      }

      res.json(existingUser)
    }
  )

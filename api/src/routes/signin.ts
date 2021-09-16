import { Request, Response, Router } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import config from 'config'

import { Password } from '../services/password'
import { validateRequest } from '../middlewares/validate-request'
import { BadRequestError } from '../errors/bad-request-error'
import { User } from '../models/user'

export default (router: Router) =>
  router.post(
    '/users/signin',
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

      const existingUser = await User.findOne({ email })
      if (!existingUser) {
        throw new BadRequestError('Invalid credentials')
      }

      const passwordsMatch = await Password.compare(
        existingUser.password,
        password
      )
      if (!passwordsMatch) {
        throw new BadRequestError('Invalid Credentials')
      }

      req.session = {
        jwt: jwt.sign(
          {
            id: existingUser.id,
            email: existingUser.email,
          },
          config.get('jwtSecret')
        ),
      }

      res.json(existingUser)
    }
  )

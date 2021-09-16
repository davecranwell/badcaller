import { Request, Response, Router } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import config from 'config'

import { validateRequest } from '../middlewares/validate-request'
import { BadRequestError } from '../errors/bad-request-error'
import { User } from '../models/user'

export default (router: Router) =>
  router.post(
    '/users/signup',
    [
      body('email').isEmail().withMessage('Email must be valid'),
      body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const { email, password } = req.body

      const existingUser = await User.findOne({ email })

      if (existingUser) {
        throw new BadRequestError('Email in use')
      }

      const user = User.build({ email, password })
      await user.save()

      req.session = {
        jwt: jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          config.get('jwtSecret')
        ),
      }

      res.status(201).json(user)
    }
  )

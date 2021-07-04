import express, { Request, Response } from 'express'

import signIn from './signin'
import signoutRouter from './signout'
import signupRouter from './signup'
import currentUserRouter from './current-user'

const router = express.Router()

signIn(router)
signoutRouter(router)
signupRouter(router)
currentUserRouter(router)

export default router

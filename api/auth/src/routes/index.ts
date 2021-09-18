import express from 'express'

import signIn from './sign-in'
import signOut from './sign-out'
// import signupRouter from './signup'
import currentUser from './current-user'

const router = express.Router()

signIn(router)
signOut(router)
// signupRouter(router)
currentUser(router)

export default router

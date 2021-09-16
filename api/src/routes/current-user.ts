import { Router } from 'express'
import { currentUser } from '../middlewares/current-user'
import { requireAuth } from '../middlewares/require-auth'

export default (router: Router) =>
  router.get('/users/currentuser', currentUser, requireAuth, (req, res) => {
    res.json({ user: req.user || null })
  })

import { Router } from 'express'
import jwt from 'jsonwebtoken'
import config from 'config'

export default (router: Router) =>
  router.get('/users/currentuser', (req, res) => {
    if (!req.session?.jwt) {
      return res.json({ currentUser: null })
    }

    try {
      const payload = jwt.verify(req.session.jwt, config.get('jwtSecret'))
      res.json({ currentUser: payload })
    } catch (err) {
      res.json({ currentUser: null })
    }
  })

import { Router } from 'express'

export default (router: Router) =>
  router.post('/signout', (req, res) => {
    req.session = null

    res.json({ message: 'Session ended' })
  })

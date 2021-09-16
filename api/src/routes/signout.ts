import { Router } from 'express'

export default (router: Router) =>
  router.post('/users/signout', (req, res) => {
    req.session = null
    res.json({})
  })

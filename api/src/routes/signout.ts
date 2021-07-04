import { Router } from 'express'

export default (router: Router) =>
  router.post('/users/signout', (req, res) => {
    res.json('Hi there!')
  })

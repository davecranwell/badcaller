import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import makeLogger from './logger'

const logger = makeLogger('api')
const router = express.Router()

router.get('/ping', (req, res) => {
  return res
})

export default router

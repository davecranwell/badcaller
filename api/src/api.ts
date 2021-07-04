import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'

const router = express.Router()

router.post(
  '/number',
  body('number')
    .isString()
    .trim()
    .matches(/^[0-9]*$/)
    .isLength({ min: 5, max: 20 })
    .withMessage(`Field 'number' is missing or invalid`),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage(`Field 'rating' is missing or invalid`),
  async (req: Request, res: Response) => {
    const errors = validationResult(req)

    // add current IP
    // add current datetime

    if (!errors.isEmpty()) {
      return res.status(500).json({ errors: errors.array() })
    }
    return res.json({ message: 'success' })
  }
)

router.get('/number/:numberId', (req, res) => {
  const { numberId } = req.params
  return res.json({ message: numberId })
})

export default router

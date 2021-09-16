import express, { Request, Response } from 'express'
import 'express-async-errors'
import cors from 'cors'
import cookieSession from 'cookie-session'
import { errorHandler } from 'badcaller-common-lib/middlewares/error-handler'
import { NotFoundError } from 'badcaller-common-lib/errors/not-found'

import routes from './routes'

const app = express()

app.set('trust proxy', true)
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
)

app.use('/', routes)

app.get('/ping', (req, res) => {
  return res.json({ message: 'pong' })
})

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export default app

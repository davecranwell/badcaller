import express, { Request, Response } from 'express'
import 'express-async-errors'
import cors from 'cors'
import cookieSession from 'cookie-session'

import { errorHandler } from './middlewares/error-handler'
import { NotFoundError } from './errors/not-found-error'

import routes from './routes'

const app = express()

app.set('trust proxy', true)
app.use(cors())
app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
)

app.use('/api', routes)

app.get('/ping', (req, res) => {
  return res.json({ status: 'success ', message: 'pong' })
})

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export default app

import path from 'path'
import express, { Request, Response } from 'express'
import helmet from 'helmet'
import cors from 'cors'

import { errorHandler } from '../../lib/middlewares/error-handler'
import { NotFoundError } from '../../lib/errors/not-found'
import api from './api'

const app = express()

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        objectSrc: ["'self'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'self'"],
      },
    },
  })
)
app.use(cors())
app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.use(
  '/',
  express.static(path.join(__dirname, '..', '..', 'client', 'build'))
)

app.get('/static', (req, res) => {
  express.static(path.join(__dirname, '..', '..', 'client', 'build', 'static'))
})

app.get('/ping', (req, res) => {
  return res.json({ message: 'pong' })
})

app.use('/api', api)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export default app

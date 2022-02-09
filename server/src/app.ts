import path from 'path'
import express, { Request, Response } from 'express'
import helmet from 'helmet'
import cors from 'cors'

import { countryDB } from './database'
import api from './api'

const app = express()

countryDB.findOne({ _id: 'country' }, (err, doc) => {
  if (doc) app.set('country', doc.value)
})

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

app.use('/api/v1', api)

app.use((req, res) => {
  return res.status(404).json({ message: 'Not found' })
})

app.use((err: Error, req: Request, res: Response) => {
  return res.status(500).json({ message: 'Error' })
})

export default app

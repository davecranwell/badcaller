import path from 'path'
import express, { Request, Response } from 'express'
import helmet from 'helmet'
import cors from 'cors'

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

app.get('/static', function (req, res) {
  express.static(path.join(__dirname, '..', '..', 'client', 'build', 'static'))
})

app.use('/api', api)

app.use((req, res) => {
  return res.status(404).json({ message: 'Not found' })
})

app.use((err: Error, req: Request, res: Response) => {
  return res.status(500).json({ message: 'Error' })
})

export default app

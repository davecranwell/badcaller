import express, { Request, Response } from 'express'
import axios, { AxiosRequestConfig, Method } from 'axios'
import { BadRequestError } from 'badcaller-common-lib/errors/bad-request'

import registry from './registry.json'

const router = express.Router()

router.all('/:endpoint', async (req: Request, res: Response) => {
  if (!registry.services[req.params.endpoint]) {
    throw new BadRequestError('Endpoint not found')
  }

  const axiosConfig: AxiosRequestConfig = {
    method: req.method as Method,
    url: registry.services[req.params.endpoint].url + req.params.path,
    headers: req.header,
    data: req.body,
  }

  return axios(axiosConfig).then((response) => res.send(response.data))
})

export default router

import { Controller, Post } from '@overnightjs/core'
import { Beach } from '@src/models/beach'
import { Request, Response } from 'express'

@Controller('beach')
export class BeachesController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    const beach = new Beach(req.body)
    const result = await beach.save()
    res.status(200).send(result)
  }
}

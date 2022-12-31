import { BadRequestException } from '@nestjs/common'
import { Request } from 'express'

export const fileFilter = (req: Request, file: Express.Multer.File, callback: (error: Error, acceptFile: boolean) => void) => {

  const fileExtension = file.mimetype.split('/').pop()

  const extensionsAccepted = ['jpg', 'jpeg', 'png', 'gif']

  if (extensionsAccepted.includes(fileExtension))
    return callback(null, true)

  callback(new BadRequestException(`file with extension .${ fileExtension } not accepted`), false)
}

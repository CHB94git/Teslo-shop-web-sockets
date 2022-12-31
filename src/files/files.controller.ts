import { Controller } from '@nestjs/common';
import { Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from '../utils';
import { FilesService } from './files.service';


@Controller('files')
export class FilesController {
  constructor (
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('product/:imageName')
  findOneProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {
    const path = this.filesService.getStaticProductImage(imageName)

    res.sendFile(path)
  }


  @Post('product/local-upload')
  @UseInterceptors(FileInterceptor('file', {
    // fileFilter: fileFilter
    fileFilter,
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }))
  uploadProductsImages(
    @UploadedFile() file: Express.Multer.File
  ) {
    const secureUrl = `${ this.configService.get<string>('HOST_API') }/api/files/product/${ file.filename }`

    return {
      secureUrl,
      filename: file.filename
    }
  }

}

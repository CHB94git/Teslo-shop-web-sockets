import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from 'src/utils';
import { CloudinaryService } from './cloudinary.service';


@Controller('cloudinary')
export class CloudinaryController {
  constructor (private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    storage: diskStorage({
      destination: './static/uploads',
      filename: fileNamer
    })
  }))
  async uploadImageProductToCloudinary(@UploadedFile() file: Express.Multer.File) {
    return this.cloudinaryService.uploadImageToCloudinary(file)
  }

  @Post('upload/buffer')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter
  }))
  async uploadImageProductToCloudinaryWithBuffer(@UploadedFile() file: Express.Multer.File) {
    return this.cloudinaryService.uploadImageToCloudinaryWithBuffer(file)
  }

  @Post('upload/multiple-images')
  @UseInterceptors(FilesInterceptor('files', 5, {
    fileFilter: fileFilter,
    storage: diskStorage({
      destination: './static/uploads',
      filename: fileNamer,
    })
  }))
  async uploadMultipleProductImages(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.cloudinaryService.multipleFilesUploader(files)
  }

}

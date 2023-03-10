import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import * as fs from 'fs';
import { join } from 'path';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {

  private async uploadImage(file: Express.Multer.File, folder: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
    const { filename } = file
    const pathImage: string = join(__dirname, '../../static/uploads', filename)
    const imageName: string = file.filename.split('.').shift()

    return new Promise((resolve, reject) => {
      v2.uploader.upload(pathImage, {
        resource_type: "image",
        folder,
        public_id: imageName
      }, (error, response) => {
        if (error)
          return reject(error);

        resolve(response);

        fs.unlink(pathImage, (err) => {
          if (err) throw err;
          console.log(`${ pathImage } was successfully uploaded and removed from local storage`);
        })
      })
    })
  }

  async uploadImageToCloudinary(file: Express.Multer.File) {
    try {
      this.validateIfExistsFiles(file)
      return await this.uploadImage(file, "nestjs/teslo_shop")
    } catch (error) {
      console.log({ error })
      throw new BadRequestException(error);
    }
  }

  private async uploadImageWithBuffer(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error)
          return reject(error);

        resolve(result);
      });
      toStream(file.buffer).pipe(upload);
    })
  }

  async uploadImageToCloudinaryWithBuffer(file: Express.Multer.File) {
    try {
      this.validateIfExistsFiles(file)
      return await this.uploadImageWithBuffer(file)
    } catch (error) {
      console.log(error)
      throw new BadRequestException(error);
    }
  }

  async multipleFilesUploader(files: Express.Multer.File[]) {
    // if (files.length === 0)
    if (!files.length)
      throw new BadRequestException('Something bad happened', { cause: new Error(), description: 'Files is empty' })

    const imageUrls: string[] = []

    try {
      for (const file of files) {
        const { filename } = file
        const pathImage: string = join(__dirname, '../../static/uploads', filename)
        const imageName: string = file.filename.split('.').shift()
        const { secure_url } = await this.multipleImageUpload(pathImage, "nestjs/teslo_shop/products", imageName)

        imageUrls.push(secure_url)

        fs.unlink(pathImage, (err) => {
          if (err) throw err;
          console.log(`${ pathImage } was successfully uploaded and removed from local storage`);
        })
      }
      return imageUrls
    } catch (error) {
      console.log(error)
      throw new BadRequestException(error)
    }
  }

  async multipleImageUpload(path: string, folder: string, imageName: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      v2.uploader.upload(path, {
        resource_type: "image",
        folder,
        public_id: imageName
      }, (error, result) => {
        if (error)
          return reject(error);
        resolve(result)
      })
    })
  }


  validateIfExistsFiles(file: Express.Multer.File) {
    if (!file) {
      // throw new BadRequestException('Something bad happened', { description: 'File is empty - Nothing to upload' })
      throw new HttpException("File is empty - Nothing to upload", 400, { cause: new Error("Upload failed") })
    }
  }
}

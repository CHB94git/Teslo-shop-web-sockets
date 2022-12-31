import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';


@Injectable()
export class FilesService {

  getStaticProductImage(imageName: string) {
    const path: string = join(__dirname, '../../static/products', imageName)

    if (!fs.existsSync(path))
      throw new BadRequestException(`No product found with image ${ imageName }`)

    return path
  }

}

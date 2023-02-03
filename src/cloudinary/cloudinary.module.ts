import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';

@Module({
  controllers: [CloudinaryController],
  providers: [CloudinaryService, CloudinaryProvider],
  // exports: [CloudinaryService, CloudinaryProvider],
  imports: [PassportModule]
})
export class CloudinaryModule {}

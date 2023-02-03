import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [PassportModule]
})
export class FilesModule {}

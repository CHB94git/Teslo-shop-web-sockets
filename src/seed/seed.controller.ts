import { Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { SeedService } from './seed.service';

@ApiTags('Seed')
@ApiBearerAuth()
@ApiResponse({ status: 201, description: 'DB Seed executed successfully' })
@Auth(ValidRoles.superUser, ValidRoles.admin)
@Controller('seed')
export class SeedController {
  constructor (private readonly seedService: SeedService) {}

  // @Auth(ValidRoles.admin)
  @Post()
  executeSeedDB() {
    return this.seedService.runSeedDB()
  }
}

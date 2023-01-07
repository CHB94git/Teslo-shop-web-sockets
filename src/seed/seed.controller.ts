import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';


@Controller('seed')
export class SeedController {
  constructor (private readonly seedService: SeedService) {}

  // @Auth(ValidRoles.admin)
  @Post()
  executeSeedDB() {
    return this.seedService.runSeedDB()
  }
}

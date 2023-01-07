import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthUser } from '../auth/entities/auth.entity';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';


@Injectable()
export class SeedService {

  constructor (
    private readonly productsService: ProductsService,
    @InjectRepository(AuthUser)
    private readonly _userRepository: Repository<AuthUser>
  ) {}

  async runSeedDB() {
    await this.deleteTablesDB()
    const firstUsersDB = await this.insertUsers()
    await this.insertNewProducts(firstUsersDB)
    return { success: 'Seed executed' };
  }

  private async deleteTablesDB() {
    await this.productsService.deleteAllProductsDB()

    const queryBuilder = this._userRepository.createQueryBuilder()
    await queryBuilder.delete().where({}).execute()
  }

  private async insertUsers() {
    const seedUsers = initialData.users

    const users: AuthUser[] = []

    seedUsers.forEach(user => {
      users.push(this._userRepository.create(user))
    });

    const usersDB = await this._userRepository.save(seedUsers)

    return usersDB[0]
  }

  private async insertNewProducts(user: AuthUser) {
    await this.productsService.deleteAllProductsDB()

    const products = initialData.products

    const insertManyPromises = []

    products.forEach(product => {
      insertManyPromises.push(this.productsService.create(product, user))
    })

    await Promise.all(insertManyPromises)

    return true
  }
}

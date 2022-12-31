import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';


@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService
  ) {}

  async runSeedDB() {
    await this.insertNewProducts()
    return 'Seed executed';
  }

  private async insertNewProducts() {
    await this.productsService.deleteAllProductsDB()

    const products = initialData.products

    const insertManyPromises = []

    products.forEach(product => {
      insertManyPromises.push(this.productsService.create(product))
    })

    await Promise.all(insertManyPromises)

    return true
  }
}

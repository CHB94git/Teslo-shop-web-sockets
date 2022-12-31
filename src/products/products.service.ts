import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';

import { PaginationDto } from '../common/dtos/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductImage } from './entities';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')

  constructor (
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...restProductProperties } = createProductDto

      const product = this.productRepository.create({
        ...restProductProperties,
        images: images.map(imageUrl => this.productImageRepository.create({ url: imageUrl }))
      })
      await this.productRepository.save(product)

      return { ...product, images }
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<Product[]> {
    const { limit = 10, offset = 0 } = paginationDto

    return this.productRepository.find({
      order: {
        createdAt: "DESC"
      },
      take: limit,
      skip: offset,
      //? Eager (eager: true) carga automáticamente las relaciones
      // relations: {
      //   images: true
      // }
    })
  }

  async findOne(termSearch: string): Promise<Product> {
    let product: Product

    if (isUUID(termSearch)) {
      product = await this.productRepository.findOne({ where: { id: termSearch } })
      // product = await this.productRepository.findOneBy({ id: termSearch });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod')

      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: termSearch.toUpperCase(),
          slug: termSearch.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne()
    }

    if (!product)
      throw new NotFoundException(`Product with id "${ termSearch }" not found`)

    return product
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const { images, ...dataToUpdate } = updateProductDto

    const product = await this.productRepository.preload({
      id,
      ...dataToUpdate
    })

    if (!product)
      throw new NotFoundException(`Product with id ${ id } not exists!`)

    // Create Query Runner
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } })

        product.images = images.map(
          imageUrl => this.productImageRepository.create({ url: imageUrl })
        )
      }
      // return await this.productRepository.save(product)
      await queryRunner.manager.save(product)
      await queryRunner.commitTransaction()

      return product
    } catch (error) {
      await queryRunner.rollbackTransaction()
      this.handleDBExceptions(error)
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<void> {
    const productToDelete = await this.findOne(id)
    await this.productRepository.remove(productToDelete)
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail)

    this.logger.error(error)
    // console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }

  async deleteAllProductsDB() {
    const query = this.productRepository.createQueryBuilder('product')

    try {
      return await query.delete().where({}).execute()
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }
}

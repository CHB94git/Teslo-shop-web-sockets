import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { AuthUser } from '../../auth/entities/auth.entity';
import { ProductImage } from './';


@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: '9309a0cf-0723-4918-9d49-d26b59e1f634',
    description: 'Product ID (uuid) auto generated',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'T-shirt',
    description: 'Product title',
    uniqueItems: true
  })
  @Column('text', {
    unique: true,
  })
  title: string;

  @ApiProperty({
    example: 550.50,
    description: 'Product price in float format',
    default: 0
  })
  @Column('float', {
    default: 0
  })
  price: number;

  @ApiProperty({
    default: null,
    nullable: true,
    example: 'Ut laboris mollit ad commodo.',
  })
  @Column({
    type: 'text',
    nullable: true
  })
  description: string;

  @ApiProperty({
    uniqueItems: true,
    example: 'men_battery_day_tee',
    description: 'Product Slug - for SEO'
  })
  @Column({
    type: 'text',
    unique: true
  })
  slug: string;

  @ApiProperty({
    default: 0,
    description: 'Available amount for the product'
  })
  @Column('int', {
    default: 0
  })
  stock: number;

  @ApiProperty({
    example: ['S', 'M', 'L'],
    description: 'Product sizes',
    isArray: true
  })
  @Column('text', {
    array: true
  })
  sizes: string[];

  @ApiProperty({
    example: 'men',
    description: 'Product gender'
  })
  @Column('text')
  gender: string;

  @ApiProperty({
    example: ['shirt', 'others...'],
    description: 'Product tags',
    isArray: true,
    default: []
  })
  @Column('text', {
    array: true,
    default: []
  })
  tags: string[];

  @ApiPropertyOptional({
    example: ['image1.jpg', 'image2.png'],
    description: 'Array with URL strings of images',
    isArray: true,
    // nullable: true
  })
  @OneToMany(() => ProductImage,
    productImage => productImage.product,
    {
      cascade: true,
      eager: true
    })
  @Transform(({ value }) => {
    return value.map((img: ProductImage) => img.url);
  })
  images?: ProductImage[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(
    () => AuthUser,
    user => user.product,
    { eager: true }
  )
  user: AuthUser

  @BeforeInsert()
  checkSlugToInsert() {
    if (!this.slug)
      this.slug = this.title

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '')

  }

  @BeforeUpdate()
  checkSlugToUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '')
  }
}

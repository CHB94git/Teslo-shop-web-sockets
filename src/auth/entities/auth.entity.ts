import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from '../../products/entities/product.entity';

@Entity('users')
export class AuthUser {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('text', {
    unique: true
  })
  email: string

  @Column('text', {
    select: false
  })
  password: string

  @Column('text')
  fullName: string

  @Column('bool', {
    default: true
  })
  isActive: boolean

  @Column('text', {
    array: true,
    default: ['user']
  })
  roles: string[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(
    () => Product,
    product => product.user
  )
  product: Product

  @BeforeInsert()
  checkFieldsToInsert() {
    this.email = this.email.toLowerCase().trim()
  }

  @BeforeUpdate()
  checkFieldsToUpdate() {
    this.checkFieldsToInsert()
  }
}

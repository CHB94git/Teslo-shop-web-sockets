import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';


export class CreateProductDto {
  @ApiProperty({
    example: 'This is a product title'
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiPropertyOptional()
  @IsNumber()
  // @IsPositive()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional()
  @IsInt()
  // @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty({
    example: ['S', 'M', 'XL']
  })
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @ApiProperty({
    enum: ['men', 'women', 'kid', 'unisex']
  })
  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;

  @ApiPropertyOptional({
    example: ['shirt', '...']
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags?: Array<string>

  @ApiPropertyOptional()
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[]
}

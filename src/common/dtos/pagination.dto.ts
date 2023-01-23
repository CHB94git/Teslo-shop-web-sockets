import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator'


export class PaginationDto {
  @ApiPropertyOptional({
    default: 10,
    description: 'How many rows do you need?'
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  @IsNumber()
  limit?: number

  @ApiPropertyOptional({
    minimum: 0,
    default: 0,
    description: 'How many rows do you want to skip?'
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  @IsNumber()
  offset?: number
}
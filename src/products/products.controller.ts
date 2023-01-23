import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { Query, UseInterceptors } from '@nestjs/common/decorators';
import { ClassSerializerInterceptor } from '@nestjs/common/serializer';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth, GetUser } from '../auth/decorators';
import { AuthUser } from '../auth/entities/auth.entity';
import { ValidRoles } from '../auth/interfaces';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities';
import { ProductsService } from './products.service';

@ApiTags('Products')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('products')
export class ProductsController {
  constructor (private readonly productsService: ProductsService) {}

  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Product was created successfully', type: Product })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Auth(ValidRoles.admin)
  @Post()
  create(@Body() createProductDto: CreateProductDto,
    @GetUser() user: AuthUser
  ) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':termSearch')
  findOne(@Param('termSearch') termSearch: string) {
    return this.productsService.findOne(termSearch);
  }

  @ApiBearerAuth()
  @Auth(ValidRoles.admin)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: AuthUser
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @ApiBearerAuth()
  @Auth(ValidRoles.admin)
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}

import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Auth, GetUser, RawHeaders } from './decorators';
import { RoleProtected } from './decorators/role-protected/role-protected.decorator';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthUser } from './entities/auth.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor (private readonly authService: AuthService) {}

  @ApiResponse({ status: 201, description: 'User was created successfully!', type: CreateUserDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @ApiResponse({ status: 200, description: 'User is logged in!', type: LoginUserDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @ApiBearerAuth()
  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: AuthUser,
  ) {
    return this.authService.checkAuthStatus(user)
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('private')
  testingPrivateRoute(
    @GetUser() user: AuthUser,
    @GetUser('email') userEmail: AuthUser,
    @RawHeaders() rawHeaders: string[]
  ) {
    return {
      ok: true,
      message: 'Private route',
      user,
      userEmail,
      rawHeaders
    }
  }

  // @SetMetadata('roles', ['admin', 'super-user'])
  @ApiBearerAuth()
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  @Get('private2')
  testingPrivateRoute2(
    @GetUser() user: AuthUser,
  ) {
    return {
      ok: true,
      message: 'Private route 2',
      user,
    }
  }

  @ApiBearerAuth()
  @Auth()
  @Get('private3')
  testingPrivateRoute3(
    @GetUser() user: AuthUser,
  ) {
    return {
      ok: true,
      message: 'Private route 3',
      user,
    }
  }
}

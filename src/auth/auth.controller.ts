import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Auth, GetUser, RawHeaders } from './decorators';
import { RoleProtected } from './decorators/role-protected/role-protected.decorator';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthUser } from './entities/auth.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces';


@Controller('auth')
export class AuthController {
  constructor (private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: AuthUser,
  ) {
    return this.authService.checkAuthStatus(user)
  }

  @UseGuards(AuthGuard())
  @Get('private')
  testingPrivateRoute(
    @GetUser() user: AuthUser,
    @GetUser('email') userEmail: AuthUser,
    @RawHeaders() rawHeaders: string[]
  ) {
    // console.log({ user })
    // console.log({ rawHeaders })
    return {
      ok: true,
      message: 'Private route',
      user,
      userEmail,
      rawHeaders
    }
  }

  // @SetMetadata('roles', ['admin', 'super-user'])

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

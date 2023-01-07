import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthUser } from './entities/auth.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';


@Injectable()
export class AuthService {
  constructor (
    @InjectRepository(AuthUser)
    private readonly _userRepository: Repository<AuthUser>,
    private readonly _jwtService: JwtService
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto

      const user = this._userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      })

      await this._userRepository.save(user)
      delete user.password

      return {
        ...user,
        token: this.getJWT({ id: user.id })
      }
    } catch (error) {
      this.handleDBErrors(error)
    }
  }

  async login(loginUserDto: LoginUserDto) {

    const { password, email } = loginUserDto

    const user = await this._userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true }
    })

    if (!user)
      throw new UnauthorizedException('Not valid credentials (email)')

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Not valid credentials (password)')

    return {
      ...user,
      token: this.getJWT({ id: user.id })
    }

  }

  async checkAuthStatus(user: AuthUser) {
    const authUser = await this._userRepository.findOne({
      where: { id: user.id },
      select: { email: true, id: true, fullName: true, roles: true }
    })

    return {
      ...authUser,
      token: this.getJWT({ id: authUser.id })
    }
  }

  private getJWT(jwtPayload: JwtPayload) {
    const token = this._jwtService.sign(jwtPayload)
    return token
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505')
      throw new BadRequestException(error.detail)

    console.log(error)

    throw new InternalServerErrorException('Please check server logs')
  }
}

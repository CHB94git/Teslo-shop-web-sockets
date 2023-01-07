import { Injectable } from '@nestjs/common';
import { NotFoundException, UnauthorizedException } from '@nestjs/common/exceptions';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { AuthUser } from '../entities/auth.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor (
    @InjectRepository(AuthUser)
    private readonly _userRepository: Repository<AuthUser>,
    configService: ConfigService
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    })
  }

  async validate(payload: JwtPayload): Promise<AuthUser> {
    const { id } = payload
    const user = await this._userRepository.findOneBy({ id })

    if (!user) throw new NotFoundException(`${ user.id } not found!`)

    if (!user.isActive) throw new UnauthorizedException(`${ user.id } appears as inactive, talk with an admin!`)

    return user
  }
}
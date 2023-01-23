import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'example@email.com',
    description: 'User email to register'
  })
  @IsString()
  @IsEmail()
  email: string

  @ApiProperty({
    minLength: 6,
    example: '******',
    description: 'User password - required minimum 6 characters'
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have a Uppercase, lowercase letter and a number'
  })
  password: string

  @ApiProperty({
    required: true,
    example: 'John Doe',
    description: 'User Fullname'
  })
  @IsString()
  @MinLength(1)
  fullName: string
}

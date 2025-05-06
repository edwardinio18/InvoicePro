import {
  IsEmail as _IsEmail,
  IsString as _IsString,
  ValidationOptions,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const IsEmail = _IsEmail as (opts?: ValidationOptions) => PropertyDecorator;
const IsString = _IsString as (opts?: ValidationOptions) => PropertyDecorator;

export class LoginDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  password: string;
}

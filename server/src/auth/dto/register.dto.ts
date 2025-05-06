import {
  IsEmail as _IsEmail,
  IsString as _IsString,
  MinLength as _MinLength,
  ValidationOptions,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const IsEmail = _IsEmail as (opts?: ValidationOptions) => PropertyDecorator;
const IsString = _IsString as (opts?: ValidationOptions) => PropertyDecorator;
const MinLength = _MinLength as (
  min: number,
  opts?: ValidationOptions,
) => PropertyDecorator;

export class RegisterDto {
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
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @IsString()
  name: string;
}

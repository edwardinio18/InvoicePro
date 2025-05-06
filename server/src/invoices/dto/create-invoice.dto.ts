import {
  IsEmail as _IsEmail,
  IsString as _IsString,
  IsNumber as _IsNumber,
  IsBoolean as _IsBoolean,
  IsOptional as _IsOptional,
  IsDateString as _IsDateString,
  ValidationOptions,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const IsString = _IsString as (opts?: ValidationOptions) => PropertyDecorator;
const IsNumber = _IsNumber as (opts?: ValidationOptions) => PropertyDecorator;
const IsBoolean = _IsBoolean as (opts?: ValidationOptions) => PropertyDecorator;
const IsOptional = _IsOptional as (
  opts?: ValidationOptions,
) => PropertyDecorator;
const IsDateString = _IsDateString as (
  opts?: ValidationOptions,
) => PropertyDecorator;

export class CreateInvoiceDto {
  @ApiProperty({
    description: 'Name of the vendor',
    example: 'Acme Corp',
  })
  @IsString()
  vendor_name: string;

  @ApiProperty({
    description: 'Amount of the invoice',
    example: 150.5,
    type: Number,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Due date of the invoice',
    example: '2025-12-31',
    type: String,
  })
  @IsDateString()
  due_date: string;

  @ApiProperty({
    description: 'Description of the invoice',
    example: 'Consulting services',
  })
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'Whether the invoice has been paid',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  paid?: boolean;
}

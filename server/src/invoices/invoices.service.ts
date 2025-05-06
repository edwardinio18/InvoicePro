import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Invoice } from '@prisma/client';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { PaginatedResult, PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Invoice[]> {
    return this.prisma.invoice.findMany();
  }

  async findAllByUserId(
    userId: number,
    pagination?: PaginationDto,
  ): Promise<PaginatedResult<Invoice>> {
    const { page = 0, limit = 10 } = pagination || {};

    const [data, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where: { userId },
        skip: page * limit,
        take: limit,
      }),
      this.prisma.invoice.count({
        where: { userId },
      }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAllByUserIdSorted(
    userId: number,
    sortDirection: 'asc' | 'desc',
    pagination?: PaginationDto,
  ): Promise<PaginatedResult<Invoice>> {
    const direction: 'asc' | 'desc' = sortDirection === 'asc' ? 'asc' : 'desc';

    const { page = 0, limit = 10 } = pagination || {};

    const [data, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where: { userId },
        orderBy: {
          amount: direction,
        },
        skip: page * limit,
        take: limit,
      }),
      this.prisma.invoice.count({
        where: { userId },
      }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Invoice> {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice with id ${id} not found`);
    }
    return invoice;
  }

  async create(
    userId: number,
    createInvoiceDto: CreateInvoiceDto,
  ): Promise<Invoice> {
    return this.prisma.invoice.create({
      data: {
        ...createInvoiceDto,
        due_date: new Date(createInvoiceDto.due_date),
        userId,
      },
    });
  }
}

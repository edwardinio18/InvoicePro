import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { Invoice } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { PaginatedResult, PaginationDto } from '../common/dto/pagination.dto';

class InvoiceEntity implements Partial<Invoice> {
  id: number;
  vendor_name: string;
  amount: number;
  due_date: Date;
  description: string;
  paid: boolean;
  createdAt: Date;
  userId: number;
}

class PaginatedInvoiceEntity implements PaginatedResult<InvoiceEntity> {
  data: InvoiceEntity[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@ApiTags('invoices')
@ApiBearerAuth()
@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @ApiOperation({ summary: 'Get all invoices (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Returns the list of all invoices',
    type: InvoiceEntity,
    isArray: true,
  })
  @Get('all')
  findAll(): Promise<Invoice[]> {
    return this.invoicesService.findAll();
  }

  @ApiOperation({
    summary: 'Get invoices for the current user with pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the paginated list of invoices for the current user',
    type: PaginatedInvoiceEntity,
  })
  @ApiQuery({
    name: 'sortDirection',
    enum: ['asc', 'desc'],
    required: false,
    description: 'Sort direction for amount: asc or desc',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (0-indexed)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page',
    type: Number,
  })
  @Get()
  findInvoices(
    @Request() req,
    @Query('sortDirection') sortDirection?: 'asc' | 'desc',
    @Query() paginationDto?: PaginationDto,
  ): Promise<PaginatedResult<Invoice>> {
    const userId = req.user.id;

    return sortDirection
      ? this.invoicesService.findAllByUserIdSorted(
          userId,
          sortDirection,
          paginationDto,
        )
      : this.invoicesService.findAllByUserId(userId, paginationDto);
  }

  @ApiOperation({ summary: 'Get invoice by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Invoice ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the invoice with the specified ID',
    type: InvoiceEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Invoice not found',
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Invoice> {
    return this.invoicesService.findOne(id);
  }

  @ApiOperation({ summary: 'Create a new invoice' })
  @ApiBody({ type: CreateInvoiceDto })
  @ApiResponse({
    status: 201,
    description: 'Invoice created successfully',
    type: InvoiceEntity,
  })
  @Post()
  create(
    @Request() req,
    @Body() createInvoiceDto: CreateInvoiceDto,
  ): Promise<Invoice> {
    return this.invoicesService.create(req.user.id, createInvoiceDto);
  }
}

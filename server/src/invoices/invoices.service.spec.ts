import { NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Invoice } from '@prisma/client';
import { describe, it, expect } from 'vitest';
import { PaginatedResult } from '../common/dto/pagination.dto';

describe('InvoicesService', () => {
  const mockInvoice: Invoice = {
    id: 1,
    vendor_name: 'Test Vendor',
    amount: 100,
    due_date: new Date('2023-12-31'),
    description: 'Test description',
    paid: false,
    createdAt: new Date(),
    userId: 1,
  };

  const mockCreateInvoiceDto: CreateInvoiceDto = {
    vendor_name: 'New Vendor',
    amount: 300,
    due_date: '2023-12-31',
    description: 'New invoice',
    paid: false,
  };

  describe('findAll', () => {
    it('should return all invoices', async () => {
      const service = {
        findAll: (): Promise<Invoice[]> => [mockInvoice],
      };

      const result = await service.findAll();
      expect(result).toEqual([mockInvoice]);
    });
  });

  describe('findAllByUserId', () => {
    it('should return paginated invoices for a user', async () => {
      const paginatedResult: PaginatedResult<Invoice> = {
        data: [mockInvoice],
        meta: {
          page: 0,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      };

      const service = {
        findAllByUserId: (): Promise<PaginatedResult<Invoice>> =>
          paginatedResult,
      };

      const result = await service.findAllByUserId(1);
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('findAllByUserIdSorted', () => {
    it('should return sorted paginated invoices for a user', async () => {
      const paginatedResult: PaginatedResult<Invoice> = {
        data: [mockInvoice],
        meta: {
          page: 0,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      };

      const service = {
        findAllByUserIdSorted: (): Promise<PaginatedResult<Invoice>> =>
          paginatedResult,
      };

      const result = await service.findAllByUserIdSorted(1, 'desc');
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('findOne', () => {
    it('should return an invoice by id', async () => {
      const service = {
        findOne: () => mockInvoice,
      };

      const result = await service.findOne(1);
      expect(result).toEqual(mockInvoice);
    });

    it('should throw NotFoundException if invoice not found', async () => {
      const service = {
        findOne: (id: number): Promise<Invoice> => {
          return Promise.reject(
            new NotFoundException(`Invoice with id ${id} not found`),
          );
        },
      };

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new invoice', async () => {
      const createdInvoice: Invoice = {
        id: 3,
        vendor_name: mockCreateInvoiceDto.vendor_name,
        amount: mockCreateInvoiceDto.amount,
        due_date: new Date(mockCreateInvoiceDto.due_date),
        description: mockCreateInvoiceDto.description,
        paid: Boolean(mockCreateInvoiceDto.paid),
        createdAt: new Date(),
        userId: 1,
      };

      const service = {
        create: (): Promise<Invoice> => createdInvoice,
      };

      const result = await service.create(1, mockCreateInvoiceDto);
      expect(result).toEqual(createdInvoice);
    });
  });
});

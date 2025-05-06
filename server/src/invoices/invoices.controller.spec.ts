import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { NotFoundException } from '@nestjs/common';
import { PaginationDto } from '../common/dto/pagination.dto';

describe('InvoicesController', () => {
  let controller: InvoicesController;
  let invoicesService: any;

  const mockInvoice = {
    id: 1,
    vendor_name: 'Test Vendor',
    amount: 100,
    due_date: new Date('2023-12-31'),
    description: 'Test invoice',
    paid: false,
    createdAt: new Date(),
    userId: 1,
  };

  const mockUser = {
    id: 1,
    username: 'testuser',
  };

  beforeEach(() => {
    invoicesService = {
      findAll: vi.fn(),
      findAllByUserId: vi.fn(),
      findAllByUserIdSorted: vi.fn(),
      findOne: vi.fn(),
      create: vi.fn(),
    };

    controller = new InvoicesController(invoicesService);

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of invoices', async () => {
      invoicesService.findAll.mockResolvedValue([mockInvoice]);

      const result = await controller.findAll();

      expect(result).toEqual([mockInvoice]);
      expect(invoicesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findInvoices', () => {
    it('should return invoices for the current user without sorting', async () => {
      const paginatedResult = {
        data: [mockInvoice],
        meta: {
          page: 0,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      };

      invoicesService.findAllByUserId.mockResolvedValue(paginatedResult);

      const req = { user: mockUser };
      const paginationDto: PaginationDto = {
        page: 0,
        limit: 10,
      };

      const result = await controller.findInvoices(
        req,
        undefined,
        paginationDto,
      );

      expect(result).toEqual(paginatedResult);
      expect(invoicesService.findAllByUserId).toHaveBeenCalledWith(
        mockUser.id,
        paginationDto,
      );
      expect(invoicesService.findAllByUserIdSorted).not.toHaveBeenCalled();
    });

    it('should return sorted invoices for the current user', async () => {
      const paginatedResult = {
        data: [mockInvoice],
        meta: {
          page: 0,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      };

      invoicesService.findAllByUserIdSorted.mockResolvedValue(paginatedResult);

      const req = { user: mockUser };
      const sortDirection = 'desc';
      const paginationDto: PaginationDto = {
        page: 0,
        limit: 10,
      };

      const result = await controller.findInvoices(
        req,
        sortDirection,
        paginationDto,
      );

      expect(result).toEqual(paginatedResult);
      expect(invoicesService.findAllByUserIdSorted).toHaveBeenCalledWith(
        mockUser.id,
        sortDirection,
        paginationDto,
      );
      expect(invoicesService.findAllByUserId).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an invoice by id', async () => {
      invoicesService.findOne.mockResolvedValue(mockInvoice);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockInvoice);
      expect(invoicesService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if invoice not found', async () => {
      invoicesService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
      expect(invoicesService.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('create', () => {
    it('should create and return a new invoice', async () => {
      const createInvoiceDto: CreateInvoiceDto = {
        vendor_name: 'New Vendor',
        amount: 300,
        due_date: '2023-12-31',
        description: 'New invoice',
        paid: false,
      };

      const createdInvoice = {
        id: 2,
        ...createInvoiceDto,
        due_date: new Date(createInvoiceDto.due_date),
        createdAt: new Date(),
        userId: mockUser.id,
      };

      invoicesService.create.mockResolvedValue(createdInvoice);

      const req = { user: mockUser };
      const result = await controller.create(req, createInvoiceDto);

      expect(result).toEqual(createdInvoice);
      expect(invoicesService.create).toHaveBeenCalledWith(
        mockUser.id,
        createInvoiceDto,
      );
    });
  });
});

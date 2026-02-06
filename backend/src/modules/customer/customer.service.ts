import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async create(workspaceId: string, dto: CreateCustomerDto) {
    // Verify store belongs to workspace
    const store = await this.prisma.store.findFirst({
      where: {
        id: dto.storeId,
        workspaceId,
      },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    // Check if customer with same phone already exists in this store
    const existing = await this.prisma.customer.findUnique({
      where: {
        storeId_phone: {
          storeId: dto.storeId,
          phone: dto.phone,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Customer with this phone number already exists in this store');
    }

    return this.prisma.customer.create({
      data: {
        ...dto,
        country: dto.country || 'SA',
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll(workspaceId: string, storeId?: string) {
    return this.prisma.customer.findMany({
      where: {
        store: {
          workspaceId,
          ...(storeId && { id: storeId }),
        },
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(workspaceId: string, id: string) {
    const customer = await this.prisma.customer.findFirst({
      where: {
        id,
        store: {
          workspaceId,
        },
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
          },
        },
        orders: {
          select: {
            id: true,
            orderNumber: true,
            total: true,
            status: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async update(workspaceId: string, id: string, dto: UpdateCustomerDto) {
    // Verify customer belongs to workspace
    const customer = await this.prisma.customer.findFirst({
      where: {
        id,
        store: {
          workspaceId,
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // If phone is being updated, check for conflicts
    if (dto.phone && dto.phone !== customer.phone) {
      const existing = await this.prisma.customer.findUnique({
        where: {
          storeId_phone: {
            storeId: customer.storeId,
            phone: dto.phone,
          },
        },
      });

      if (existing) {
        throw new ConflictException('Customer with this phone number already exists in this store');
      }
    }

    return this.prisma.customer.update({
      where: { id },
      data: dto,
      include: {
        store: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async remove(workspaceId: string, id: string) {
    // Verify customer belongs to workspace
    const customer = await this.prisma.customer.findFirst({
      where: {
        id,
        store: {
          workspaceId,
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return this.prisma.customer.delete({
      where: { id },
    });
  }

  async findByPhone(workspaceId: string, storeId: string, phone: string) {
    return this.prisma.customer.findFirst({
      where: {
        storeId,
        phone,
        store: {
          workspaceId,
        },
      },
    });
  }
}

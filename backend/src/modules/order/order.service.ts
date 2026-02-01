import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  private async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // Get today's order count
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const count = await this.prisma.order.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const sequence = String(count + 1).padStart(4, '0');
    return `ORD-${year}${month}${day}-${sequence}`;
  }

  async create(userId: string, workspaceId: string, dto: CreateOrderDto) {
    // Verify store belongs to workspace
    const store = await this.prisma.store.findFirst({
      where: {
        id: dto.storeId,
        workspaceId,
      },
      include: {
        workspace: {
          include: {
            plan: true,
          },
        },
      },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    // Check order limit
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const orderCount = await this.prisma.order.count({
      where: {
        workspaceId,
        createdAt: {
          gte: currentMonth,
        },
      },
    });

    if (orderCount >= store.workspace.plan.maxOrdersPerMonth) {
      throw new BadRequestException(
        `Order limit reached. Your plan allows ${store.workspace.plan.maxOrdersPerMonth} orders per month.`,
      );
    }

    // Validate products and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of dto.items) {
      const product = await this.prisma.product.findFirst({
        where: {
          id: item.productId,
          storeId: dto.storeId,
        },
      });

      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }

      // Check stock
      if (product.trackInventory && product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        );
      }

      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        productImage: product.images?.[0] || null,
        sku: product.sku,
        quantity: item.quantity,
        price: item.price,
        total: itemTotal,
      });
    }

    const shipping = dto.shipping || 0;
    const tax = dto.tax || 0;
    const discount = dto.discount || 0;
    const total = subtotal + shipping + tax - discount;

    // Generate order number
    const orderNumber = await this.generateOrderNumber();

    // Create order with items in a transaction
    const order = await this.prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          workspaceId,
          storeId: dto.storeId,
          orderNumber,
          customerName: dto.customerName,
          customerEmail: dto.customerEmail,
          customerPhone: dto.customerPhone,
          customerAddress: dto.customerAddress,
          customerCity: dto.customerCity,
          customerState: dto.customerState,
          customerZipCode: dto.customerZipCode,
          customerCountry: dto.customerCountry || 'SA',
          subtotal,
          shipping,
          tax,
          discount,
          total,
          currency: store.currency,
          paymentMethod: dto.paymentMethod || 'COD',
          notes: dto.notes,
          source: dto.source,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          store: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      // Update product stock
      for (const item of dto.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (product && product.trackInventory) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      // Update store total orders and revenue
      await tx.store.update({
        where: { id: dto.storeId },
        data: {
          totalOrders: {
            increment: 1,
          },
          totalRevenue: {
            increment: total,
          },
        },
      });

      return newOrder;
    });

    return order;
  }

  async findAll(
    userId: string,
    workspaceId: string,
    storeId?: string,
    status?: string,
  ) {
    const where: any = {
      workspaceId,
    };

    if (storeId) {
      where.storeId = storeId;
    }

    if (status) {
      where.status = status;
    }

    return this.prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, workspaceId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        workspaceId,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true,
              },
            },
          },
        },
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async update(
    userId: string,
    workspaceId: string,
    orderId: string,
    dto: UpdateOrderDto,
  ) {
    // Check if order exists and belongs to workspace
    await this.findOne(userId, workspaceId, orderId);

    const updateData: any = { ...dto };

    // Auto-set dates based on status changes
    if (dto.paymentStatus === 'PAID' && !dto.paidAt) {
      updateData.paidAt = new Date();
    }

    if (dto.fulfillmentStatus === 'FULFILLED' && !dto.deliveredAt) {
      updateData.deliveredAt = new Date();
    }

    if (dto.status === 'CANCELED' && !dto.cancelReason) {
      updateData.canceledAt = new Date();
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
  }

  async delete(userId: string, workspaceId: string, orderId: string) {
    // Check if order exists and belongs to workspace
    await this.findOne(userId, workspaceId, orderId);

    await this.prisma.order.delete({
      where: { id: orderId },
    });

    return { message: 'Order deleted successfully' };
  }

  async getStats(userId: string, workspaceId: string, storeId?: string) {
    const where: any = { workspaceId };
    if (storeId) {
      where.storeId = storeId;
    }

    const [totalOrders, totalRevenue, pendingOrders, completedOrders] =
      await Promise.all([
        this.prisma.order.count({ where }),
        this.prisma.order.aggregate({
          where,
          _sum: { total: true },
        }),
        this.prisma.order.count({
          where: { ...where, status: 'PENDING' },
        }),
        this.prisma.order.count({
          where: { ...where, status: 'COMPLETED' },
        }),
      ]);

    return {
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      pendingOrders,
      completedOrders,
    };
  }
}

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async create(userId: string, workspaceId: string, dto: CreateProductDto) {
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
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    // Check product limit
    if (store._count.products >= store.workspace.plan.maxProductsPerStore) {
      throw new BadRequestException(
        `Product limit reached. Your plan allows ${store.workspace.plan.maxProductsPerStore} products per store.`,
      );
    }

    // Generate unique slug
    let slug = this.generateSlug(dto.name);
    let counter = 1;
    while (
      await this.prisma.product.findFirst({
        where: {
          storeId: dto.storeId,
          slug,
        },
      })
    ) {
      slug = `${this.generateSlug(dto.name)}-${counter}`;
      counter++;
    }

    // Create product
    const product = await this.prisma.product.create({
      data: {
        storeId: dto.storeId,
        name: dto.name,
        slug,
        description: dto.description,
        price: dto.price,
        compareAtPrice: dto.compareAtPrice,
        costPrice: dto.costPrice,
        sku: dto.sku,
        trackInventory: dto.trackInventory ?? true,
        stock: dto.stock ?? 0,
        images: dto.images || [],
        video: dto.video,
        status: 'DRAFT',
      },
    });

    return product;
  }

  async findAll(
    userId: string,
    workspaceId: string,
    storeId?: string,
    status?: string,
  ) {
    const where: any = {
      store: {
        workspaceId,
      },
    };

    if (storeId) {
      where.storeId = storeId;
    }

    if (status) {
      where.status = status;
    }

    return this.prisma.product.findMany({
      where,
      include: {
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

  async findOne(userId: string, workspaceId: string, productId: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        store: {
          workspaceId,
        },
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(
    userId: string,
    workspaceId: string,
    productId: string,
    dto: UpdateProductDto,
  ) {
    // Check if product exists and belongs to workspace
    const product = await this.findOne(userId, workspaceId, productId);

    // Update slug if name changed
    let updateData: any = { ...dto };
    if (dto.name && dto.name !== product.name) {
      let newSlug = this.generateSlug(dto.name);
      let counter = 1;
      while (
        await this.prisma.product.findFirst({
          where: {
            storeId: product.storeId,
            slug: newSlug,
            NOT: { id: productId },
          },
        })
      ) {
        newSlug = `${this.generateSlug(dto.name)}-${counter}`;
        counter++;
      }
      updateData.slug = newSlug;
    }

    // Handle status change to ACTIVE
    if (dto.status === 'ACTIVE' && product.status !== 'ACTIVE') {
      updateData.publishedAt = new Date();
    }

    // Auto set OUT_OF_STOCK status
    if (dto.stock !== undefined && dto.stock === 0 && product.trackInventory) {
      updateData.status = 'OUT_OF_STOCK';
    }

    return this.prisma.product.update({
      where: { id: productId },
      data: updateData,
      include: {
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

  async delete(userId: string, workspaceId: string, productId: string) {
    // Check if product exists and belongs to workspace
    await this.findOne(userId, workspaceId, productId);

    await this.prisma.product.delete({
      where: { id: productId },
    });

    return { message: 'Product deleted successfully' };
  }

  async bulkUpdateStatus(
    userId: string,
    workspaceId: string,
    productIds: string[],
    status: string,
  ) {
    // Verify all products belong to workspace
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
        store: {
          workspaceId,
        },
      },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('Some products not found');
    }

    await this.prisma.product.updateMany({
      where: {
        id: { in: productIds },
      },
      data: {
        status: status as any,
      },
    });

    return { message: `${products.length} products updated successfully` };
  }
}

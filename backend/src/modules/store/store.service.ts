import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async create(userId: string, workspaceId: string, dto: CreateStoreDto) {
    // Get workspace with plan
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: { plan: true, stores: true },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    // Check store limit
    if (workspace.stores.length >= workspace.plan.maxStores) {
      throw new BadRequestException(
        `Store limit reached. Your plan allows ${workspace.plan.maxStores} store(s).`,
      );
    }

    // Generate unique slug
    let slug = this.generateSlug(dto.name);
    let counter = 1;
    while (
      await this.prisma.store.findUnique({
        where: { slug },
      })
    ) {
      slug = `${this.generateSlug(dto.name)}-${counter}`;
      counter++;
    }

    // Generate subdomain
    const subdomain = slug;

    // Default theme
    const defaultTheme = {
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      fontFamily: 'Inter',
      headerLayout: 'centered',
      footerLayout: 'simple',
    };

    // Create store
    const store = await this.prisma.store.create({
      data: {
        workspaceId,
        name: dto.name,
        slug,
        subdomain,
        description: dto.description,
        language: dto.language || 'ar',
        currency: dto.currency || 'SAR',
        theme: defaultTheme,
        status: 'DRAFT',
      },
      include: {
        workspace: {
          include: {
            plan: true,
          },
        },
      },
    });

    return store;
  }

  async findAll(userId: string, workspaceId: string) {
    return this.prisma.store.findMany({
      where: { workspaceId },
      include: {
        _count: {
          select: {
            products: true,
            orders: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, workspaceId: string, storeId: string) {
    const store = await this.prisma.store.findFirst({
      where: {
        id: storeId,
        workspaceId,
      },
      include: {
        _count: {
          select: {
            products: true,
            orders: true,
            customers: true,
          },
        },
      },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    return store;
  }

  async update(
    userId: string,
    workspaceId: string,
    storeId: string,
    dto: UpdateStoreDto,
  ) {
    // Check if store exists and belongs to workspace
    const store = await this.findOne(userId, workspaceId, storeId);

    // Update slug if name changed
    let updateData: any = { ...dto };
    if (dto.name && dto.name !== store.name) {
      let newSlug = this.generateSlug(dto.name);
      let counter = 1;
      while (
        await this.prisma.store.findFirst({
          where: {
            slug: newSlug,
            NOT: { id: storeId },
          },
        })
      ) {
        newSlug = `${this.generateSlug(dto.name)}-${counter}`;
        counter++;
      }
      updateData.slug = newSlug;
    }

    // Handle status change to PUBLISHED
    if (dto.status === 'PUBLISHED' && store.status !== 'PUBLISHED') {
      updateData.publishedAt = new Date();
    }

    return this.prisma.store.update({
      where: { id: storeId },
      data: updateData,
      include: {
        _count: {
          select: {
            products: true,
            orders: true,
            customers: true,
          },
        },
      },
    });
  }

  async delete(userId: string, workspaceId: string, storeId: string) {
    // Check if store exists and belongs to workspace
    await this.findOne(userId, workspaceId, storeId);

    await this.prisma.store.delete({
      where: { id: storeId },
    });

    return { message: 'Store deleted successfully' };
  }

  async getStats(userId: string, workspaceId: string) {
    const stores = await this.prisma.store.findMany({
      where: { workspaceId },
      select: {
        id: true,
        totalOrders: true,
        totalRevenue: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    const totalStores = stores.length;
    const totalProducts = stores.reduce((sum, store) => sum + store._count.products, 0);
    const totalOrders = stores.reduce((sum, store) => sum + store.totalOrders, 0);
    const totalRevenue = stores.reduce((sum, store) => sum + store.totalRevenue, 0);

    return {
      totalStores,
      totalProducts,
      totalOrders,
      totalRevenue,
    };
  }
}

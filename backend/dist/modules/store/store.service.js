"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let StoreService = class StoreService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    async create(userId, workspaceId, dto) {
        const workspace = await this.prisma.workspace.findUnique({
            where: { id: workspaceId },
            include: { plan: true, stores: true },
        });
        if (!workspace) {
            throw new common_1.NotFoundException('Workspace not found');
        }
        if (workspace.stores.length >= workspace.plan.maxStores) {
            throw new common_1.BadRequestException(`Store limit reached. Your plan allows ${workspace.plan.maxStores} store(s).`);
        }
        let slug = this.generateSlug(dto.name);
        let counter = 1;
        while (await this.prisma.store.findUnique({
            where: { slug },
        })) {
            slug = `${this.generateSlug(dto.name)}-${counter}`;
            counter++;
        }
        const subdomain = slug;
        const defaultTheme = {
            primaryColor: '#3B82F6',
            secondaryColor: '#10B981',
            fontFamily: 'Inter',
            headerLayout: 'centered',
            footerLayout: 'simple',
        };
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
    async findAll(userId, workspaceId) {
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
    async findOne(userId, workspaceId, storeId) {
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
            throw new common_1.NotFoundException('Store not found');
        }
        return store;
    }
    async update(userId, workspaceId, storeId, dto) {
        const store = await this.findOne(userId, workspaceId, storeId);
        let updateData = { ...dto };
        if (dto.name && dto.name !== store.name) {
            let newSlug = this.generateSlug(dto.name);
            let counter = 1;
            while (await this.prisma.store.findFirst({
                where: {
                    slug: newSlug,
                    NOT: { id: storeId },
                },
            })) {
                newSlug = `${this.generateSlug(dto.name)}-${counter}`;
                counter++;
            }
            updateData.slug = newSlug;
        }
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
    async delete(userId, workspaceId, storeId) {
        await this.findOne(userId, workspaceId, storeId);
        await this.prisma.store.delete({
            where: { id: storeId },
        });
        return { message: 'Store deleted successfully' };
    }
    async getStats(userId, workspaceId) {
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
};
exports.StoreService = StoreService;
exports.StoreService = StoreService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StoreService);
//# sourceMappingURL=store.service.js.map
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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ProductService = class ProductService {
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
            throw new common_1.NotFoundException('Store not found');
        }
        if (store._count.products >= store.workspace.plan.maxProductsPerStore) {
            throw new common_1.BadRequestException(`Product limit reached. Your plan allows ${store.workspace.plan.maxProductsPerStore} products per store.`);
        }
        let slug = this.generateSlug(dto.name);
        let counter = 1;
        while (await this.prisma.product.findFirst({
            where: {
                storeId: dto.storeId,
                slug,
            },
        })) {
            slug = `${this.generateSlug(dto.name)}-${counter}`;
            counter++;
        }
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
    async findAll(userId, workspaceId, storeId, status) {
        const where = {
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
    async findOne(userId, workspaceId, productId) {
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
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async update(userId, workspaceId, productId, dto) {
        const product = await this.findOne(userId, workspaceId, productId);
        let updateData = { ...dto };
        if (dto.name && dto.name !== product.name) {
            let newSlug = this.generateSlug(dto.name);
            let counter = 1;
            while (await this.prisma.product.findFirst({
                where: {
                    storeId: product.storeId,
                    slug: newSlug,
                    NOT: { id: productId },
                },
            })) {
                newSlug = `${this.generateSlug(dto.name)}-${counter}`;
                counter++;
            }
            updateData.slug = newSlug;
        }
        if (dto.status === 'ACTIVE' && product.status !== 'ACTIVE') {
            updateData.publishedAt = new Date();
        }
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
    async delete(userId, workspaceId, productId) {
        await this.findOne(userId, workspaceId, productId);
        await this.prisma.product.delete({
            where: { id: productId },
        });
        return { message: 'Product deleted successfully' };
    }
    async bulkUpdateStatus(userId, workspaceId, productIds, status) {
        const products = await this.prisma.product.findMany({
            where: {
                id: { in: productIds },
                store: {
                    workspaceId,
                },
            },
        });
        if (products.length !== productIds.length) {
            throw new common_1.BadRequestException('Some products not found');
        }
        await this.prisma.product.updateMany({
            where: {
                id: { in: productIds },
            },
            data: {
                status: status,
            },
        });
        return { message: `${products.length} products updated successfully` };
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductService);
//# sourceMappingURL=product.service.js.map
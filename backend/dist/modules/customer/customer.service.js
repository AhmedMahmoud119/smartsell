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
exports.CustomerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let CustomerService = class CustomerService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(workspaceId, dto) {
        const store = await this.prisma.store.findFirst({
            where: {
                id: dto.storeId,
                workspaceId,
            },
        });
        if (!store) {
            throw new common_1.NotFoundException('Store not found');
        }
        const existing = await this.prisma.customer.findUnique({
            where: {
                storeId_phone: {
                    storeId: dto.storeId,
                    phone: dto.phone,
                },
            },
        });
        if (existing) {
            throw new common_1.ConflictException('Customer with this phone number already exists in this store');
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
    async findAll(workspaceId, storeId) {
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
    async findOne(workspaceId, id) {
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
            throw new common_1.NotFoundException('Customer not found');
        }
        return customer;
    }
    async update(workspaceId, id, dto) {
        const customer = await this.prisma.customer.findFirst({
            where: {
                id,
                store: {
                    workspaceId,
                },
            },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
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
                throw new common_1.ConflictException('Customer with this phone number already exists in this store');
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
    async remove(workspaceId, id) {
        const customer = await this.prisma.customer.findFirst({
            where: {
                id,
                store: {
                    workspaceId,
                },
            },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        return this.prisma.customer.delete({
            where: { id },
        });
    }
    async findByPhone(workspaceId, storeId, phone) {
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
};
exports.CustomerService = CustomerService;
exports.CustomerService = CustomerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CustomerService);
//# sourceMappingURL=customer.service.js.map
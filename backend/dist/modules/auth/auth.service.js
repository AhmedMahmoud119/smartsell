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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma/prisma.service");
const locales_1 = require("../../common/constants/locales");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already registered');
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const freePlan = await this.prisma.plan.findUnique({
            where: { slug: 'free' },
        });
        if (!freePlan) {
            throw new common_1.BadRequestException('Free plan not found');
        }
        const result = await this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email: dto.email,
                    passwordHash,
                    name: dto.name,
                    phone: dto.phone,
                    locale: dto.locale || locales_1.DEFAULT_LOCALE,
                    provider: 'email',
                },
            });
            const baseSlug = this.generateSlug(dto.workspaceName);
            const slug = await this.ensureUniqueSlug(baseSlug, tx);
            const workspace = await tx.workspace.create({
                data: {
                    name: dto.workspaceName,
                    slug,
                    planId: freePlan.id,
                },
            });
            await tx.workspaceMember.create({
                data: {
                    userId: user.id,
                    workspaceId: workspace.id,
                    role: 'OWNER',
                },
            });
            await tx.subscription.create({
                data: {
                    workspaceId: workspace.id,
                    planId: freePlan.id,
                    status: 'ACTIVE',
                    currentPeriodStart: new Date(),
                    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                },
            });
            return { user, workspace };
        });
        const tokens = await this.generateTokens(result.user.id, result.user.email);
        return {
            user: {
                id: result.user.id,
                email: result.user.email,
                name: result.user.name,
            },
            workspace: {
                id: result.workspace.id,
                name: result.workspace.name,
                slug: result.workspace.slug,
            },
            ...tokens,
        };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
            include: {
                workspaces: {
                    include: {
                        workspace: {
                            include: {
                                plan: true,
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.passwordHash) {
            throw new common_1.UnauthorizedException('Please login with Google (OAuth account)');
        }
        const validPassword = await bcrypt.compare(dto.password, user.passwordHash);
        if (!validPassword) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        const tokens = await this.generateTokens(user.id, user.email);
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                locale: user.locale,
            },
            workspaces: user.workspaces.map((wm) => ({
                id: wm.workspace.id,
                name: wm.workspace.name,
                slug: wm.workspace.slug,
                role: wm.role,
                plan: wm.workspace.plan.name,
            })),
            ...tokens,
        };
    }
    async googleLogin(googleUser) {
        let user = await this.prisma.user.findUnique({
            where: { email: googleUser.email },
            include: {
                workspaces: {
                    include: {
                        workspace: {
                            include: {
                                plan: true,
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            const freePlan = await this.prisma.plan.findUnique({
                where: { slug: 'free' },
            });
            const result = await this.prisma.$transaction(async (tx) => {
                const newUser = await tx.user.create({
                    data: {
                        email: googleUser.email,
                        name: googleUser.name,
                        provider: 'google',
                        providerId: googleUser.providerId,
                        emailVerified: true,
                        verifiedAt: new Date(),
                        locale: 'ar',
                    },
                });
                const baseSlug = this.generateSlug(googleUser.name);
                const slug = await this.ensureUniqueSlug(baseSlug, tx);
                const workspace = await tx.workspace.create({
                    data: {
                        name: `${googleUser.name}'s Workspace`,
                        slug,
                        planId: freePlan.id,
                    },
                });
                await tx.workspaceMember.create({
                    data: {
                        userId: newUser.id,
                        workspaceId: workspace.id,
                        role: 'OWNER',
                    },
                });
                await tx.subscription.create({
                    data: {
                        workspaceId: workspace.id,
                        planId: freePlan.id,
                        status: 'ACTIVE',
                        currentPeriodStart: new Date(),
                        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    },
                });
                return newUser;
            });
            user = await this.prisma.user.findUnique({
                where: { id: result.id },
                include: {
                    workspaces: {
                        include: {
                            workspace: {
                                include: {
                                    plan: true,
                                },
                            },
                        },
                    },
                },
            });
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        const tokens = await this.generateTokens(user.id, user.email);
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            workspaces: user.workspaces.map((wm) => ({
                id: wm.workspace.id,
                name: wm.workspace.name,
                slug: wm.workspace.slug,
                role: wm.role,
                plan: wm.workspace.plan.name,
            })),
            ...tokens,
        };
    }
    async generateTokens(userId, email) {
        const payload = { sub: userId, email };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, { expiresIn: '30d' }),
        ]);
        await this.prisma.session.create({
            data: {
                userId,
                token: refreshToken,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
        });
        return { accessToken, refreshToken };
    }
    generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50);
    }
    async ensureUniqueSlug(baseSlug, tx) {
        let slug = baseSlug;
        let counter = 1;
        while (true) {
            const existing = await tx.workspace.findUnique({
                where: { slug },
            });
            if (!existing) {
                return slug;
            }
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
    }
    async logout(userId, refreshToken) {
        await this.prisma.session.deleteMany({
            where: {
                userId,
                token: refreshToken,
            },
        });
        return { message: 'Logged out successfully' };
    }
    async refreshTokens(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const session = await this.prisma.session.findFirst({
                where: {
                    userId: payload.sub,
                    token: refreshToken,
                },
            });
            if (!session) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const tokens = await this.generateTokens(payload.sub, payload.email);
            await this.prisma.session.delete({
                where: { id: session.id },
            });
            return tokens;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
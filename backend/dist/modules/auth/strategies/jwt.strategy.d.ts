import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    validate(payload: {
        sub: string;
        email: string;
    }): Promise<{
        workspaces: ({
            workspace: {
                plan: {
                    currency: string;
                    name: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    slug: string;
                    price: number;
                    maxStores: number;
                    maxProductsPerStore: number;
                    maxOrdersPerMonth: number;
                    maxAiGenerations: number;
                    customDomain: boolean;
                    multiCurrency: boolean;
                    whatsappIntegration: boolean;
                    analyticsAdvanced: boolean;
                    conversionAPI: boolean;
                    removeBranding: boolean;
                    prioritySupport: boolean;
                    active: boolean;
                };
            } & {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                planId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            workspaceId: string;
            userId: string;
            role: import(".prisma/client").$Enums.Role;
        })[];
    } & {
        email: string;
        name: string;
        phone: string | null;
        locale: string;
        id: string;
        passwordHash: string | null;
        emailVerified: boolean;
        verifiedAt: Date | null;
        provider: string | null;
        providerId: string | null;
        createdAt: Date;
        updatedAt: Date;
        lastLoginAt: Date | null;
    }>;
}
export {};

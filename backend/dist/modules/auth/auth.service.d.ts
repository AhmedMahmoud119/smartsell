import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
        };
        workspace: {
            id: string;
            name: string;
            slug: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            locale: string;
        };
        workspaces: {
            id: string;
            name: string;
            slug: string;
            role: import(".prisma/client").$Enums.Role;
            plan: string;
        }[];
    }>;
    googleLogin(googleUser: any): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
        };
        workspaces: {
            id: string;
            name: string;
            slug: string;
            role: import(".prisma/client").$Enums.Role;
            plan: string;
        }[];
    }>;
    private generateTokens;
    private generateSlug;
    private ensureUniqueSlug;
    logout(userId: string, refreshToken: string): Promise<{
        message: string;
    }>;
    refreshTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}

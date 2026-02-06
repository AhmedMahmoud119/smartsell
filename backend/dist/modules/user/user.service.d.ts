import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    getCurrentUser(userId: string): Promise<{
        workspaces: {
            id: string;
            name: string;
            slug: string;
            role: import(".prisma/client").$Enums.Role;
            plan: {
                name: string;
                slug: string;
            };
        }[];
        id: string;
        email: string;
        name: string;
        phone: string;
        locale: string;
        emailVerified: boolean;
        createdAt: Date;
    }>;
    updateProfile(userId: string, data: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string;
        locale: string;
    }>;
}

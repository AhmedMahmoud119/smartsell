import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getCurrentUser(user: any): Promise<{
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
    updateProfile(user: any, data: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string;
        locale: string;
    }>;
}

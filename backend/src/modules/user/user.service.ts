import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        locale: true,
        emailVerified: true,
        createdAt: true,
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

    return {
      ...user,
      workspaces: user.workspaces.map((wm) => ({
        id: wm.workspace.id,
        name: wm.workspace.name,
        slug: wm.workspace.slug,
        role: wm.role,
        plan: {
          name: wm.workspace.plan.name,
          slug: wm.workspace.plan.slug,
        },
      })),
    };
  }

  async updateProfile(userId: string, data: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        locale: true,
      },
    });
  }
}

import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { DEFAULT_LOCALE } from '../../common/constants/locales';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Get free plan
    const freePlan = await this.prisma.plan.findUnique({
      where: { slug: 'free' },
    });

    if (!freePlan) {
      throw new BadRequestException('Free plan not found');
    }

    // Create user + workspace in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email: dto.email,
          passwordHash,
          name: dto.name,
          phone: dto.phone,
          locale: dto.locale || DEFAULT_LOCALE,
          provider: 'email',
        },
      });

      // Generate unique workspace slug
      const baseSlug = this.generateSlug(dto.workspaceName);
      const slug = await this.ensureUniqueSlug(baseSlug, tx);

      // Create workspace
      const workspace = await tx.workspace.create({
        data: {
          name: dto.workspaceName,
          slug,
          planId: freePlan.id,
        },
      });

      // Create workspace membership
      await tx.workspaceMember.create({
        data: {
          userId: user.id,
          workspaceId: workspace.id,
          role: 'OWNER',
        },
      });

      // Create subscription
      await tx.subscription.create({
        data: {
          workspaceId: workspace.id,
          planId: freePlan.id,
          status: 'ACTIVE',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ), // 30 days
        },
      });

      return { user, workspace };
    });

    // Generate tokens
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

  async login(dto: LoginDto) {
    // Find user
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
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    if (!user.passwordHash) {
      throw new UnauthorizedException(
        'Please login with Google (OAuth account)',
      );
    }

    const validPassword = await bcrypt.compare(dto.password, user.passwordHash);
    if (!validPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
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

  async googleLogin(googleUser: any) {
    // Find or create user
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

    // If user doesn't exist, create with workspace
    if (!user) {
      const freePlan = await this.prisma.plan.findUnique({
        where: { slug: 'free' },
      });

      const result = await this.prisma.$transaction(async (tx) => {
        // Create user
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

        // Create default workspace
        const baseSlug = this.generateSlug(googleUser.name);
        const slug = await this.ensureUniqueSlug(baseSlug, tx);

        const workspace = await tx.workspace.create({
          data: {
            name: `${googleUser.name}'s Workspace`,
            slug,
            planId: freePlan.id,
          },
        });

        // Create membership
        await tx.workspaceMember.create({
          data: {
            userId: newUser.id,
            workspaceId: workspace.id,
            role: 'OWNER',
          },
        });

        // Create subscription
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

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
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

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, { expiresIn: '30d' }),
    ]);

    // Store session
    await this.prisma.session.create({
      data: {
        userId,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken };
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  }

  private async ensureUniqueSlug(baseSlug: string, tx: any): Promise<string> {
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

  async logout(userId: string, refreshToken: string) {
    await this.prisma.session.deleteMany({
      where: {
        userId,
        token: refreshToken,
      },
    });

    return { message: 'Logged out successfully' };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);

      const session = await this.prisma.session.findFirst({
        where: {
          userId: payload.sub,
          token: refreshToken,
        },
      });

      if (!session) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(payload.sub, payload.email);

      // Delete old session
      await this.prisma.session.delete({
        where: { id: session.id },
      });

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";

import { PrismaService } from "../prisma/prisma.service";
import { AcceptInviteDto, InviteUserDto } from "./dto/invite-user.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async invite(dto: InviteUserDto) {
    const normalizedEmail = dto.email.trim().toLowerCase();

    const exists = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (exists) {
      throw new ConflictException("이미 가입된 이메일입니다.");
    }

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

    const invite = await this.prisma.inviteToken.create({
      data: {
        email: normalizedEmail,
        token,
        expiresAt,
      },
    });

    // 프론트에서 받을 초대 링크(가입 페이지는 다음 단계에서 구현)
    const inviteUrl = `http://localhost:3000/accept-invite?token=${invite.token}`;

    return {
      inviteUrl,
      expiresAt: invite.expiresAt,
    };
  }

  async verifyInvite(token: string) {
    const t = (token ?? "").trim();
    if (!t) {
      throw new BadRequestException("token is required");
    }

    const invite = await this.prisma.inviteToken.findUnique({
      where: { token: t },
    });

    if (!invite) {
      throw new NotFoundException("Invalid invite token");
    }

    if (invite.usedAt) {
      throw new BadRequestException("Invite token already used");
    }

    if (invite.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException("Invite token expired");
    }

    return {
      email: invite.email,
      expiresAt: invite.expiresAt,
    };
  }

  async acceptInvite(dto: AcceptInviteDto) {
    const token = (dto.token ?? "").trim();
    const name = (dto.name ?? "").trim();

    if (!token) {
      throw new BadRequestException("token is required");
    }
    if (!name) {
      throw new BadRequestException("name is required");
    }

    const user = await this.prisma.$transaction(async (tx) => {
      const invite = await tx.inviteToken.findUnique({
        where: { token },
      });

      if (!invite) {
        throw new NotFoundException("Invalid invite token");
      }

      if (invite.usedAt) {
        throw new BadRequestException("Invite token already used");
      }

      if (invite.expiresAt.getTime() < Date.now()) {
        throw new BadRequestException("Invite token expired");
      }

      const existingUser = await tx.user.findUnique({
        where: { email: invite.email },
      });

      if (existingUser) {
        throw new ConflictException("User already exists for this email");
      }

      const created = await tx.user.create({
        data: {
          email: invite.email,
          name,
          status: "ACTIVE",
        },
      });

      // 기본 권한: 가입 시 VIEWER 자동 부여
      const viewerRole = await tx.role.findUnique({
        where: { code: "VIEWER" },
        select: { id: true },
      });

      if (!viewerRole) {
        throw new NotFoundException(
          "Default role VIEWER not found. Please seed roles first.",
        );
      }

      await tx.userRole.create({
        data: {
          userId: created.id,
          roleId: viewerRole.id,
        },
      });

      await tx.inviteToken.update({
        where: { token },
        data: { usedAt: new Date() },
      });

      return created;
    });

    return user;
  }

    async list() {
    const users = await this.prisma.user.findMany({
      include: {
        roles: {
          select: { roleId: true }, // UserRole 테이블에서 roleId만
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // 프론트(UserRow)가 쓰기 좋은 형태로 변환해서 리턴
    return users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      status: u.status,
      roleIds: u.roles.map((r) => r.roleId),
      updatedAt: u.updatedAt,
    }));
  }
}
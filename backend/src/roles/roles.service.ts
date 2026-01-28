import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    const roles = await this.prisma.role.findMany({
      orderBy: { code: "asc" },
      include: { _count: { select: { users: true } } },
    });

    return roles.map((r) => ({
      id: r.id,
      code: r.code,
      name: r.name,
      description: r.description,
      type: r.type,
      userCount: r._count.users,
      updatedAt: r.updatedAt,
    }));
  }

  async create(dto: CreateRoleDto) {
    try {
      const created = await this.prisma.role.create({
        data: {
          code: dto.code,
          name: dto.name,
          description: dto.description ?? null,
          type: dto.type,
        },
      });

      return { ...created, userCount: 0 };
    } catch (e: any) {
      if (e?.code === "P2002") {
        throw new ConflictException(`Role code already exists: ${dto.code}`);
      }
      throw e;
    }
  }

  async update(id: string, dto: UpdateRoleDto) {
    const exists = await this.prisma.role.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException(`Role not found: ${id}`);

    const data: any = {};
    if (dto.name !== undefined) data.name = dto.name.trim();
    if (dto.type !== undefined) data.type = dto.type;
    if (dto.description !== undefined) data.description = dto.description ?? null;

    const updated = await this.prisma.role.update({
      where: { id },
      data,
    });

    const userCount = await this.prisma.userRole.count({
      where: { roleId: id },
    });

    return { ...updated, userCount };
  }

  async remove(id: string) {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) throw new NotFoundException(`Role not found: ${id}`);

    const userCount = await this.prisma.userRole.count({ where: { roleId: id } });
    if (userCount > 0) {
      throw new BadRequestException(
        `Cannot delete role. ${userCount} user(s) are assigned to this role.`,
      );
    }

    await this.prisma.role.delete({ where: { id } });

    return { ok: true, id };
  }
}

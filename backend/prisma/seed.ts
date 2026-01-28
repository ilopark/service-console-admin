import "dotenv/config";
import { PrismaClient, UserStatus } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is missing. Check backend/.env");

  const pool = new Pool({ connectionString: url });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    // 1) Roles (system roles)
    const adminRole = await prisma.role.upsert({
      where: { code: "ADMIN" },
      update: {
        name: "Admin",
        description: "Full access",
        type: "system",
      },
      create: {
        code: "ADMIN",
        name: "Admin",
        description: "Full access",
        type: "system",
      },
    });

    const viewerRole = await prisma.role.upsert({
      where: { code: "VIEWER" },
      update: {
        name: "Viewer",
        description: "Read-only access",
        type: "system",
      },
      create: {
        code: "VIEWER",
        name: "Viewer",
        description: "Read-only access",
        type: "system",
      },
    });

    const supportRole = await prisma.role.upsert({
      where: { code: "SUPPORT" },
      update: {
        name: "Support",
        description: "Support operations access",
        type: "system",
      },
      create: {
        code: "SUPPORT",
        name: "Support",
        description: "Support operations access",
        type: "system",
      },
    });

    // 2) Users (3 users)
    const adminUser = await prisma.user.upsert({
      where: { email: "admin@opshub.io" },
      update: { name: "Admin", status: UserStatus.ACTIVE },
      create: { email: "admin@opshub.io", name: "Admin", status: UserStatus.ACTIVE },
    });

    const viewerUser = await prisma.user.upsert({
      where: { email: "viewer@opshub.io" },
      update: { name: "Viewer", status: UserStatus.ACTIVE },
      create: { email: "viewer@opshub.io", name: "Viewer", status: UserStatus.ACTIVE },
    });

    const supportUser = await prisma.user.upsert({
      where: { email: "support@opshub.io" },
      update: { name: "Support", status: UserStatus.ACTIVE },
      create: { email: "support@opshub.io", name: "Support", status: UserStatus.ACTIVE },
    });

    // 3) UserRole mappings (N:N)
    await prisma.userRole.createMany({
      data: [
        { userId: adminUser.id, roleId: adminRole.id },
        { userId: viewerUser.id, roleId: viewerRole.id },
        { userId: supportUser.id, roleId: supportRole.id },
      ],
      skipDuplicates: true,
    });

    // 4) AuditLog (optional)
    const existingSeedLog = await prisma.auditLog.findFirst({
      where: { action: "SEED_INIT", target: "System" },
    });

    if (!existingSeedLog) {
      await prisma.auditLog.create({
        data: {
          action: "SEED_INIT",
          target: "System",
          actorId: adminUser.id,
          meta: {
            roles: ["ADMIN", "VIEWER", "SUPPORT"],
            users: ["admin@opshub.io", "viewer@opshub.io", "support@opshub.io"],
          },
        },
      });
    }

    console.log("✅ Seed completed");
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});

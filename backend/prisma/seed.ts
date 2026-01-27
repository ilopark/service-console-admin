import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, UserStatus } from "@prisma/client";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is missing in backend/.env");

const pool = new Pool({ connectionString: url });
const adapter = new PrismaPg(pool);

// ✅ Prisma 7: adapter를 옵션으로 줘야 함
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { code: "ADMIN" },
    update: { name: "Admin" },
    create: { code: "ADMIN", name: "Admin" },
  });

  const viewerRole = await prisma.role.upsert({
    where: { code: "VIEWER" },
    update: { name: "Viewer" },
    create: { code: "VIEWER", name: "Viewer" },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@opshub.io" },
    update: { name: "Admin", status: UserStatus.ACTIVE },
    create: { email: "admin@opshub.io", name: "Admin", status: UserStatus.ACTIVE },
  });

  await prisma.userRole.createMany({
    data: [{ userId: adminUser.id, roleId: adminRole.id }],
    skipDuplicates: true,
  });

  await prisma.auditLog.create({
    data: {
      action: "SEED_INIT",
      target: "System",
      targetId: null,
      actorId: adminUser.id,
      meta: { roles: ["ADMIN", "VIEWER"], adminEmail: adminUser.email },
    },
  });

  console.log("✅ Seed completed");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

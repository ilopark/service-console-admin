import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node -r dotenv/config node_modules/ts-node/dist/bin.js prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
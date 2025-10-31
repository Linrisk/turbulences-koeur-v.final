import { config } from "dotenv";
import { resolve } from "path";

// Charge le .env avant d'importer Prisma
config({ path: resolve(__dirname, "../.env") });

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

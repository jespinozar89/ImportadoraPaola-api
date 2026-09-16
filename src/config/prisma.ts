import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient();
  // new PrismaClient({
  //   log: ['query', 'info', 'warn', 'error'], // Analizar redimiento Consultas
  // });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
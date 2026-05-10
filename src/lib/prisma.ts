import { PrismaClient } from "@prisma/client";

declare global {
  var __makerpipelinePrisma: PrismaClient | undefined;
}

export function getDb() {
  if (!global.__makerpipelinePrisma) {
    global.__makerpipelinePrisma = new PrismaClient();
  }

  return global.__makerpipelinePrisma;
}

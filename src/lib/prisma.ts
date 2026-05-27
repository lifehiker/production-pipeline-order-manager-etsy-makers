import { PrismaClient } from "@prisma/client";

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
declare global {
  var __makerpipelinePrisma: PrismaClient | undefined;
}

export function getDb() {
  if (!global.__makerpipelinePrisma) {
    global.__makerpipelinePrisma = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./dev.db" }) });
  }

  return global.__makerpipelinePrisma;
}

import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";


// 1. Setup global variable (prevents too many connections in dev)
const globalForPrisma = global as unknown as { prisma: PrismaClient };


// 2. Create PostgreSQL connection pool
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });


// 3. Create Prisma Adapter
const adapter = new PrismaPg(pool);


// 4. Initialize Prisma Client with Adapter
export const prisma =
globalForPrisma.prisma || new PrismaClient({ adapter });


if (process.env.NODE_ENV !== "production") {
globalForPrisma.prisma = prisma;
}
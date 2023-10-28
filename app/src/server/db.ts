import { type Prisma, PrismaClient } from "@prisma/client";
import { createPrismaRedisCache } from "prisma-redis-middleware";
import Redis from "ioredis";
import { env } from "@/env.mjs";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// const redis = new Redis(process.env.REDIS_URL!);
const cacheMiddleware: Prisma.Middleware = createPrismaRedisCache({
  // storage: { type: "redis", options: { client: redis, invalidation: { referencesTTL: 300 }, log: console } },
  storage: { type: 'memory' },
  cacheTime: 300,
  onHit: (key) => {
    console.log("hit", key);
  },
  onMiss: (key) => {
    console.log("miss", key);
  },
  onError: (key) => {
    console.log("error", key);
  },
});

prisma.$use(cacheMiddleware);

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

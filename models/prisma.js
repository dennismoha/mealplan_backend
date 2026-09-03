const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const globalStore = globalThis;
const createClient = () => {
  const adapter = new PrismaMariaDb({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectionLimit: Number(process.env.PRISMA_POOL_LIMIT || 10),
    acquireTimeout: Number(process.env.PRISMA_POOL_TIMEOUT_MS || 30000),
    idleTimeout: Number(process.env.PRISMA_POOL_IDLE_SECONDS || 60),
    allowPublicKeyRetrieval: true,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    connectTimeout: 10000,
  });
  return new PrismaClient({
    adapter,
    log: process.env.LOG_SQL === 'true' ? ['query', 'warn', 'error'] : ['warn', 'error'],
  });
};

const prisma = globalStore.mealPlanPrisma || createClient();

if (process.env.NODE_ENV !== 'production') globalStore.mealPlanPrisma = prisma;

module.exports = prisma;

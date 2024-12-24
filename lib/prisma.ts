import { PrismaClient } from '@prisma/client';

declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient;
}

let prismaClient: PrismaClient;

if (process.env.NODE_ENV === 'production') {
    prismaClient = new PrismaClient();
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient({
            log: ['info', 'warn', 'error'],
        });
    }
    prismaClient = global.prisma;
}

export default prismaClient;

// Add type export
export type PrismaDB = typeof prismaClient;

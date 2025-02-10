import { prisma } from "../../../../prisma/prisma.js";

export class PostgresGetTransactionsByUserIdRepository {
    async execute(userId, from, to) {
        const transactions = await prisma.transaction.findMany({
            where: {
                userId: userId,
                date: {
                    gte: new Date(from),
                    lte: new Date(to),
                },
            },
        });

        return transactions;
    }
}

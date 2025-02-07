import { prisma } from "../../../../prisma/prisma.js";

export class PostgresGetTransactionsByIdRepository {
    async execute(id) {
        const transaction = await prisma.transaction.findUnique({
            where: { id },
        });

        return transaction;
    }
}

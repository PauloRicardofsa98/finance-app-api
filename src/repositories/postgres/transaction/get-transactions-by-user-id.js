import { prisma } from "../../../../prisma/prisma";

export class PostgresGetTransactionsByUserIdRepository {
    async execute(user_id) {
        const transactions = await prisma.transaction.findUnique({
            where: { user_id: user_id },
        });

        return transactions;
    }
}

import { prisma } from "../../../../prisma/prisma.js";
export class PostgresUpdateTransactionRepository {
    async execute(transactionId, updateTransactionsParams) {
        const transaction = await prisma.transaction.update({
            where: { id: transactionId },
            data: updateTransactionsParams,
        });

        return transaction;
    }
}

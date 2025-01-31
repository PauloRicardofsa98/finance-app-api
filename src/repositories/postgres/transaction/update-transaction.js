import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../../../../prisma/prisma.js";
import { TransactionNotFoundError } from "../../../errors/transaction.js";
export class PostgresUpdateTransactionRepository {
    async execute(transactionId, updateTransactionsParams) {
        try {
            return await prisma.transaction.update({
                where: { id: transactionId },
                data: updateTransactionsParams,
            });
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    throw new TransactionNotFoundError(transactionId);
                }
            }
            throw error;
        }
    }
}

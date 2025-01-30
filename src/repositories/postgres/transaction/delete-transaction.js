import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../../../../prisma/prisma.js";
import { TransactionNotFoundError } from "../../../errors";

export class PostgresDeleteTransactionRepository {
    async execute(transactionId) {
        try {
            return await prisma.transaction.delete({
                where: { id: transactionId },
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

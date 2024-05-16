import { PostgresHelper } from "../../../db/postgres/helper";

export class PostgresDeleteTransaction {
    async execute(transactionId) {
        const transaction = await PostgresHelper.query(
            "DELETE FROM transactions WHERE id = $1 RETURNING *",
            [transactionId],
        );
        return transaction[0];
    }
}

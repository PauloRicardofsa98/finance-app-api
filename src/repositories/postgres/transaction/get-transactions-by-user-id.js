import { PostgresHelper } from "../../../db/postgres/helper.js";

export class PostgresGetTransactionsByUserId {
    async execute(user_id) {
        const transactions = await PostgresHelper.query(
            `SELECT * FROM transactions WHERE user_id = $1`,
            [user_id],
        );
        return transactions;
    }
}

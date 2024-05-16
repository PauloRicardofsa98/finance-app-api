import { PostgresHelper } from "../../../db/postgres/helper.js";

export class PostgresGetUserBalanceRepository {
    async execute(userId) {
        const balance = await PostgresHelper.query(
            `
        SELECT
            SUM(CASE WHEN type = 'EARNING' THEN amount ELSE 0 END) AS earning,
            SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) AS expenses,
            SUM(CASE WHEN type = 'INVESTIMENT' THEN amount ELSE 0 END) AS investiments,
            (
                SUM(CASE WHEN type = 'EARNING' THEN amount ELSE 0 END)
                - SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END)
                - SUM(CASE WHEN type = 'INVESTIMENT' THEN amount ELSE 0 END)
            ) AS balance
        FROM transactions
        WHERE user_id = $1;
        `,
            [userId],
        );
        return { userId, ...balance[0] };
    }
}

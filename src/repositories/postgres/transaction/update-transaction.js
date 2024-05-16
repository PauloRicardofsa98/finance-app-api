import { PostgresHelper } from "../../../db/postgres/helper.js";

export class PostgressUpdateTransactionRepository {
    async execute(userId, updateTrasactionsParams) {
        const updateFields = [];
        const updateValues = [];

        Object.keys(updateTrasactionsParams).forEach((key) => {
            updateFields.push(`${key} = $${updateValues.length + 1}`);
            updateValues.push(updateTrasactionsParams[key]);
        });

        updateValues.push(userId);

        const updateQuery = `
            UPDATE transactions 
            SET ${updateFields.join(", ")} 
            WHERE id = $${updateValues.length} 
            RETURNING *
        `;

        const updatedTransaction = await PostgresHelper.query(
            updateQuery,
            updateValues,
        );

        return updatedTransaction[0];
    }
}

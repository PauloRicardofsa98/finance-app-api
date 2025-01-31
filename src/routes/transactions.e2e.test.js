import request from "supertest";
import { app } from "../app";
import { transaction, user } from "../tests";

describe("Transaction Routes E2E Tests", () => {
    it("POST /api/transactions should return 201 when transaction is created", async () => {
        const { body: createdUser } = await request(app)
            .post("/api/users")
            .send({
                ...user,
                id: undefined,
            });

        const response = await request(app)
            .post("/api/transactions")
            .send({
                ...transaction,
                id: undefined,
                user_id: createdUser.id,
            });

        expect(response.status).toBe(201);
        expect(response.body.user_id).toBe(createdUser.id);
        expect(response.body.amount).toBe(String(transaction.amount));
        expect(response.body.type).toBe(transaction.type);
    });
});

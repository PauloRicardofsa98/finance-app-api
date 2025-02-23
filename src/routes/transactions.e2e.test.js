import request from "supertest";
import { app } from "../app.js";
import { transaction, user } from "../tests";
import { faker } from "@faker-js/faker";

describe("Transaction Routes E2E Tests", () => {
    const from = "2025-01-01";
    const to = "2025-01-31";

    it("POST /api/transactions should return 201 when transaction is created", async () => {
        const { body: createdUser } = await request(app)
            .post("/api/users")
            .send({
                ...user,
                id: undefined,
            });

        const response = await request(app)
            .post("/api/transactions/me")
            .set("Authorization", `Bearer ${createdUser.tokens.accessToken}`)
            .send({
                ...transaction,
                id: undefined,
                userId: createdUser.id,
            });

        expect(response.status).toBe(201);
        expect(response.body.userId).toBe(createdUser.id);
        expect(response.body.amount).toBe(String(transaction.amount));
        expect(response.body.type).toBe(transaction.type);
    });

    it("GET /api/transactions should return 200 when transaction is found", async () => {
        const { body: createdUser } = await request(app)
            .post("/api/users")
            .send({
                ...user,
                id: undefined,
            });

        const { body: createdTransaction } = await request(app)
            .post("/api/transactions/me")
            .set("Authorization", `Bearer ${createdUser.tokens.accessToken}`)
            .send({
                ...transaction,
                id: undefined,
                userId: createdUser.id,
                date: new Date(from),
            });

        const response = await request(app)
            .get(`/api/transactions/me/?from=${from}&to=${to}`)
            .set("Authorization", `Bearer ${createdUser.tokens.accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body[0]).toEqual(createdTransaction);
    });

    it("PATCH /api/transactions/:transactionId should return 200 when transaction is updated", async () => {
        const { body: createdUser } = await request(app)
            .post("/api/users")
            .send({
                ...user,
                id: undefined,
            });

        const { body: createdTransaction } = await request(app)
            .post("/api/transactions/me")
            .set("Authorization", `Bearer ${createdUser.tokens.accessToken}`)
            .send({
                ...transaction,
                id: undefined,
                userId: createdUser.id,
            });

        const updateTransactionParams = {
            amount: 100,
        };

        const response = await request(app)
            .patch(`/api/transactions/me/${createdTransaction.id}`)
            .set("Authorization", `Bearer ${createdUser.tokens.accessToken}`)
            .send(updateTransactionParams);

        expect(response.status).toBe(200);
        expect(response.body.amount).toBe(
            String(updateTransactionParams.amount),
        );
    });

    it("DELETE /api/transactions/:transactionId should return 200 when transaction is deleted", async () => {
        const { body: createdUser } = await request(app)
            .post("/api/users")
            .send({
                ...user,
                id: undefined,
            });

        const { body: createdTransaction } = await request(app)
            .post("/api/transactions/me")
            .set("Authorization", `Bearer ${createdUser.tokens.accessToken}`)
            .send({
                ...transaction,
                id: undefined,
                userId: createdUser.id,
            });

        const response = await request(app)
            .delete(`/api/transactions/me/${createdTransaction.id}`)
            .set("Authorization", `Bearer ${createdUser.tokens.accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(createdTransaction);
    });

    it("DELETE /api/transactions/:transactionId should return 404 when transaction is not found", async () => {
        const { body: createdUser } = await request(app)
            .post("/api/users")
            .send({
                ...user,
                id: undefined,
            });
        const response = await request(app)
            .delete(`/api/transactions/${faker.string.uuid()}`)
            .set("Authorization", `Bearer ${createdUser.tokens.accessToken}`);

        expect(response.status).toBe(404);
    });
});

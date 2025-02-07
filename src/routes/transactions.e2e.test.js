import request from "supertest";
import { app } from "../app.js";
import { transaction, user } from "../tests";
import { faker } from "@faker-js/faker";
import { TransactionType } from "@prisma/client";

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
                userId: createdUser.id,
            });

        expect(response.status).toBe(201);
        expect(response.body.userId).toBe(createdUser.id);
        expect(response.body.amount).toBe(String(transaction.amount));
        expect(response.body.type).toBe(transaction.type);
    });

    it("GET /api/transactions?userId should return 200 when transaction is found", async () => {
        const { body: createdUser } = await request(app)
            .post("/api/users")
            .send({
                ...user,
                id: undefined,
            });

        const { body: createdTransaction } = await request(app)
            .post("/api/transactions")
            .send({
                ...transaction,
                id: undefined,
                userId: createdUser.id,
            });

        const response = await request(app).get(
            `/api/transactions?userId=${createdUser.id}`,
        );

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
            .post("/api/transactions")
            .send({
                ...transaction,
                id: undefined,
                userId: createdUser.id,
            });

        const updateTransactionParams = {
            amount: 100,
        };

        const response = await request(app)
            .patch(`/api/transactions/${createdTransaction.id}`)
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
            .post("/api/transactions")
            .send({
                ...transaction,
                id: undefined,
                userId: createdUser.id,
            });

        const response = await request(app).delete(
            `/api/transactions/${createdTransaction.id}`,
        );

        expect(response.status).toBe(200);
        expect(response.body).toEqual(createdTransaction);
    });

    it("PATCH /api/transactions/:transactionId should return 404 when transaction is not found", async () => {
        const response = await request(app)
            .patch(`/api/transactions/${faker.string.uuid()}`)
            .send({
                amount: 100,
                type: TransactionType.INVESTMENT,
            });

        expect(response.status).toBe(404);
    });

    it("DELETE /api/transactions/:transactionId should return 404 when transaction is not found", async () => {
        const response = await request(app).delete(
            `/api/transactions/${faker.string.uuid()}`,
        );

        expect(response.status).toBe(404);
    });

    it("GET /api/transactions?userId should return 404 when transaction is not found", async () => {
        const response = await request(app).get(
            `/api/transactions?userId=${faker.string.uuid()}`,
        );

        expect(response.status).toBe(404);
    });
});

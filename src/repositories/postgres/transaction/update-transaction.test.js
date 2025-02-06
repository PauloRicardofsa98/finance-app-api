import { prisma } from "../../../../prisma/prisma";
import { transaction, user } from "../../../tests";
import { PostgresUpdateTransactionRepository } from "./update-transaction";
import { faker } from "@faker-js/faker";
import { TransactionNotFoundError } from "../../../errors";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

describe("UpdateTransactionRepository", () => {
    it("should update a transaction on db", async () => {
        await prisma.user.create({ data: user });
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        });
        const params = {
            id: faker.string.uuid(),
            name: faker.string.alphanumeric(10),
            date: faker.date.anytime().toISOString(),
            type: "EXPENSE",
            amount: Number(faker.finance.amount()),
        };

        // Arrange
        const sut = new PostgresUpdateTransactionRepository();

        // Act
        const result = await sut.execute(transaction.id, params);

        // Assert

        expect(result.id).toBe(params.id);
        expect(result.name).toBe(params.name);
        expect(result.type).toBe(params.type);
        expect(result.user_id).toBe(user.id);
        expect(String(result.amount)).toBe(String(params.amount));
    });

    it("should call Prisma with correct params", async () => {
        // Arrange
        await prisma.user.create({ data: user });
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        });
        const sut = new PostgresUpdateTransactionRepository();
        const prismaSpy = import.meta.jest.spyOn(prisma.transaction, "update");

        // Act
        await sut.execute(transaction.id, { ...transaction, user_id: user.id });

        // Assert

        expect(prismaSpy).toHaveBeenCalledWith({
            where: { id: transaction.id },
            data: { ...transaction, user_id: user.id },
        });
    });

    it("should throw if prisma throws", async () => {
        // Arrange
        const sut = new PostgresUpdateTransactionRepository();
        import.meta.jest
            .spyOn(prisma.transaction, "update")
            .mockRejectedValueOnce(new Error());

        // Act
        const promise = sut.execute(transaction.id, {
            ...transaction,
            user_id: user.id,
        });

        // Assert

        await expect(promise).rejects.toThrow();
    });

    it("should throw TransactionNotFoundError if transaction does not exist to update", async () => {
        // Arrange
        const sut = new PostgresUpdateTransactionRepository();
        import.meta.jest.spyOn(prisma.user, "update").mockRejectedValueOnce(
            new PrismaClientKnownRequestError("", {
                code: "P2025",
            }),
        );

        // Act
        const promise = sut.execute(transaction.id, {
            amount: 100,
        });

        // Assert
        await expect(promise).rejects.toThrow(
            new TransactionNotFoundError(transaction.id),
        );
    });
});

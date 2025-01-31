import { prisma } from "../../../../prisma/prisma";
import { PostgresDeleteTransactionRepository } from "./delete-transaction";
import { user, transaction } from "../../../tests";
import { TransactionNotFoundError } from "../../../errors";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

describe("DeleteTransactionRepository", () => {
    it("should delete a transaction on db", async () => {
        await prisma.user.create({ data: user });
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        });

        // Arrange
        const sut = new PostgresDeleteTransactionRepository();

        // Act
        const result = await sut.execute(transaction.id);

        // Assert

        expect(result.name).toBe(transaction.name);
        expect(result.type).toBe(transaction.type);
        expect(result.user_id).toBe(user.id);
        expect(String(result.amount)).toBe(String(transaction.amount));
    });

    it("should call Prisma with correct params", async () => {
        // Arrange
        await prisma.user.create({ data: user });
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        });
        const sut = new PostgresDeleteTransactionRepository();
        const prismaSpy = jest.spyOn(prisma.transaction, "delete");

        // Act
        await sut.execute(transaction.id);

        // Assert

        expect(prismaSpy).toHaveBeenCalledWith({
            where: { id: transaction.id },
        });
    });

    it("should throw if prisma throws", async () => {
        // Arrange
        await prisma.user.create({ data: user });
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        });
        const sut = new PostgresDeleteTransactionRepository();
        jest.spyOn(prisma.transaction, "delete").mockRejectedValueOnce(
            new Error()
        );

        // Act
        const promise = sut.execute(transaction.id);

        // Assert

        await expect(promise).rejects.toThrow();
    });

    it("should throw UserNotFoundError if user does not exist", async () => {
        // Arrange
        const sut = new PostgresDeleteTransactionRepository();
        jest.spyOn(prisma.transaction, "delete").mockRejectedValueOnce(
            new PrismaClientKnownRequestError("", {
                code: "P2025",
            })
        );

        // Act
        const promise = sut.execute(transaction.id);

        // Assert

        await expect(promise).rejects.toThrow(
            new TransactionNotFoundError(transaction.id)
        );
    });
});

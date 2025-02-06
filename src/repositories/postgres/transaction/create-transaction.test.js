import { prisma } from "../../../../prisma/prisma";
import { PostgresCreateTransactionRepository } from "./create-transaction";
import { user as fakerUser, transaction } from "../../../tests";
import dayjs from "dayjs";

describe("CreateTransactionRepository", () => {
    it("should create a transaction on db", async () => {
        const user = await prisma.user.create({ data: fakerUser });
        // Arrange
        const sut = new PostgresCreateTransactionRepository();

        // Act
        const result = await sut.execute({ ...transaction, user_id: user.id });

        // Assert
        expect(result.name).toBe(transaction.name);
        expect(result.value).toBe(transaction.value);
        expect(result.user_id).toBe(user.id);
        expect(Number(result.type)).toBe(Number(transaction.type));
        expect(dayjs(result.date).day).toBe(dayjs(transaction.date).day);
    });

    it("should call Prisma with correct params", async () => {
        // Arrange
        const sut = new PostgresCreateTransactionRepository();
        const prismaSpy = import.meta.jest.spyOn(prisma.transaction, "create");

        // Act
        const user = await prisma.user.create({ data: fakerUser });
        await sut.execute({ ...transaction, user_id: user.id });

        // Assert
        expect(prismaSpy).toHaveBeenCalledWith({
            data: { ...transaction, user_id: user.id },
        });
    });

    it("should throw if prisma throws", async () => {
        // Arrange
        const sut = new PostgresCreateTransactionRepository();
        import.meta.jest
            .spyOn(prisma.transaction, "create")
            .mockRejectedValue(new Error());

        // Act
        const promise = sut.execute(transaction);

        // Assert
        await expect(promise).rejects.toThrow();
    });
});

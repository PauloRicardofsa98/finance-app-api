import { prisma } from "../../../../prisma/prisma";
import { PostgresDeleteTransactionRepository } from "./delete-transaction";
import { user, transaction } from "../../../tests";
import dayjs from "dayjs";

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
        expect(dayjs(result.date).daysInMonth()).toBe(
            dayjs(transaction.date).daysInMonth()
        );
        expect(dayjs(result.date).month()).toBe(
            dayjs(transaction.date).month()
        );
        expect(dayjs(result.date).year()).toBe(dayjs(transaction.date).year());
    });

    it("should call Prisma with correct params", async () => {
        // Arrange
        const sut = new PostgresDeleteTransactionRepository();
        const prismaSpy = jest.spyOn(prisma.transaction, "delete");

        // Act
        await sut.execute(transaction.id);

        // Assert

        expect(prismaSpy).toHaveBeenCalledWith({
            where: { id: transaction.id },
        });
    });
});

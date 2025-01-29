import dayjs from "dayjs";
import { prisma } from "../../../../prisma/prisma";
import { transaction, user } from "../../../tests";
import { PostgresUpdateTransactionRepository } from "./update-transaction";
import { faker } from "@faker-js/faker";

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
        expect(dayjs(result.date).daysInMonth()).toBe(
            dayjs(params.date).daysInMonth()
        );
        expect(dayjs(result.date).month()).toBe(dayjs(params.date).month());
        expect(dayjs(result.date).year()).toBe(dayjs(params.date).year());
    });
});

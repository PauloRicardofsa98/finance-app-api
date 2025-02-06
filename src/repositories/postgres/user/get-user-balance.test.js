import { faker } from "@faker-js/faker";
import { prisma } from "../../../../prisma/prisma.js";
import { user as fakeUser } from "../../../tests";
import { PostgresGetUserBalanceRepository } from "./get-user-balance";

describe("GetUserBalanceRepository", () => {
    it("should get user balance on db", async () => {
        const user = await prisma.user.create({
            data: fakeUser,
        });

        await prisma.transaction.createMany({
            data: [
                {
                    name: faker.string.sample(),
                    date: faker.date.recent(),
                    user_id: user.id,
                    type: "EARNING",
                    amount: 5000,
                },

                {
                    name: faker.string.sample(),
                    date: faker.date.recent(),
                    user_id: user.id,
                    type: "EARNING",
                    amount: 5000,
                },

                {
                    name: faker.string.sample(),
                    date: faker.date.recent(),
                    user_id: user.id,
                    type: "EXPENSE",
                    amount: 1000,
                },

                {
                    name: faker.string.sample(),
                    date: faker.date.recent(),
                    user_id: user.id,
                    type: "EXPENSE",
                    amount: 1000,
                },

                {
                    name: faker.string.sample(),
                    date: faker.date.recent(),
                    user_id: user.id,
                    type: "INVESTMENT",
                    amount: 3000,
                },

                {
                    name: faker.string.sample(),
                    date: faker.date.recent(),
                    user_id: user.id,
                    type: "INVESTMENT",
                    amount: 3000,
                },
            ],
        });

        //Arrange
        const sut = new PostgresGetUserBalanceRepository();

        //Act
        const result = await sut.execute(user.id);
        console.log({
            earning: result.earning.toString(),
            expenses: result.expenses.toString(),
            investments: result.investments.toString(),
            balance: result.balance.toString(),
        });

        //Assert
        expect(result.earning.toString()).toBe("10000");
        expect(result.expenses.toString()).toBe("2000");
        expect(result.investments.toString()).toBe("6000");
        expect(result.balance.toString()).toBe("2000");
    });

    it("should call Prisma with correct values", async () => {
        const user = await prisma.user.create({
            data: fakeUser,
        });

        const aggregateSpy = jest.spyOn(prisma.transaction, "aggregate");

        //Arrange
        const sut = new PostgresGetUserBalanceRepository();

        //Act
        await sut.execute(user.id);

        //Assert
        expect(aggregateSpy).toHaveBeenCalledTimes(3);
        expect(aggregateSpy).toHaveBeenCalledWith({
            where: { user_id: user.id, type: "EXPENSE" },
            _sum: {
                amount: true,
            },
        });

        expect(aggregateSpy).toHaveBeenCalledWith({
            where: { user_id: user.id, type: "EARNING" },
            _sum: {
                amount: true,
            },
        });

        expect(aggregateSpy).toHaveBeenCalledWith({
            where: { user_id: user.id, type: "INVESTMENT" },
            _sum: {
                amount: true,
            },
        });
    });

    it("should throw if Prisma throws", async () => {
        jest.spyOn(prisma.transaction, "aggregate").mockRejectedValueOnce(
            new Error(),
        );

        //Arrange
        const sut = new PostgresGetUserBalanceRepository();

        //Act
        const promise = sut.execute(fakeUser.id);

        //Assert
        await expect(promise).rejects.toThrow();
    });
});

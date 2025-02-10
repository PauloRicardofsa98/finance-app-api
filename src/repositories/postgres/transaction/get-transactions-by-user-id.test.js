import dayjs from "dayjs";
import { prisma } from "../../../../prisma/prisma";
import { transaction, user } from "../../../tests";
import { PostgresGetTransactionsByUserIdRepository } from "./get-transactions-by-user-id";

describe("GetTransactionsByUserIdRepository", () => {
    const from = "2025-01-01";
    const to = "2025-02-31";

    it("should get transactions by user id on db", async () => {
        const date = "2025-02-10";
        const sut = new PostgresGetTransactionsByUserIdRepository();
        await prisma.user.create({ data: user });
        await prisma.transaction.create({
            data: { ...transaction, userId: user.id, date: new Date(date) },
        });

        const result = await sut.execute(user.id, from, to);

        expect(result.length).toBe(1);
        expect(result[0].name).toBe(transaction.name);
        expect(result[0].type).toBe(transaction.type);
        expect(result[0].userId).toBe(user.id);
        expect(String(result[0].amount)).toBe(String(transaction.amount));

        expect(dayjs(result[0].date).daysInMonth()).toBe(
            dayjs(date).daysInMonth(),
        );
        expect(dayjs(result[0].date).month()).toBe(dayjs(date).month());
        expect(dayjs(result[0].date).year()).toBe(dayjs(date).year());
    });

    it("should call Prisma with correct params", async () => {
        const sut = new PostgresGetTransactionsByUserIdRepository();
        const prismaSpy = import.meta.jest.spyOn(
            prisma.transaction,
            "findMany",
        );

        await sut.execute(user.id, from, to);

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                userId: user.id,
                date: { gte: new Date(from), lte: new Date(to) },
            },
        });
    });

    it("should throw if prisma throws", async () => {
        const sut = new PostgresGetTransactionsByUserIdRepository();
        import.meta.jest
            .spyOn(prisma.transaction, "findMany")
            .mockRejectedValueOnce(new Error());

        const promise = sut.execute(user.id);

        await expect(promise).rejects.toThrow();
    });
});

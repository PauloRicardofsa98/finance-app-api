import { Prisma } from "@prisma/client";
import { prisma } from "../../../../prisma/prisma.js";

export class PostgresGetUserBalanceRepository {
    async execute(userId, from, to) {
        const {
            _sum: { amount: totalExpenses },
        } = await prisma.transaction.aggregate({
            where: {
                userId: userId,
                type: "EXPENSE",
                date: { gte: new Date(from), lte: new Date(to) },
            },
            _sum: {
                amount: true,
            },
        });
        const {
            _sum: { amount: totalEarnings },
        } = await prisma.transaction.aggregate({
            where: {
                userId: userId,
                type: "EARNING",
                date: { gte: new Date(from), lte: new Date(to) },
            },
            _sum: {
                amount: true,
            },
        });
        const {
            _sum: { amount: totalInvestments },
        } = await prisma.transaction.aggregate({
            where: {
                userId: userId,
                type: "INVESTMENT",
                date: { gte: new Date(from), lte: new Date(to) },
            },
            _sum: {
                amount: true,
            },
        });
        const _totalEarnings = totalEarnings || new Prisma.Decimal(0);
        const _totalExpenses = totalExpenses || new Prisma.Decimal(0);
        const _totalInvestments = totalInvestments || new Prisma.Decimal(0);

        const balance = Prisma.Decimal(
            _totalEarnings - _totalExpenses - _totalInvestments,
        );

        return {
            earning: _totalEarnings,
            expenses: _totalExpenses,
            investments: _totalInvestments,
            balance,
        };
    }
}

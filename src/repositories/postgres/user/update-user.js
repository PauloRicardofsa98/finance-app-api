import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../../../../prisma/prisma.js";
import { UserNotFoundError } from "../../../errors/user.js";

export class PostgresUpdateUserRepository {
    async execute(userId, updateParams) {
        try {
            return await prisma.user.update({
                where: { id: userId },
                data: updateParams,
            });
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    throw new UserNotFoundError(userId);
                }
            }
            throw error;
        }
    }
}

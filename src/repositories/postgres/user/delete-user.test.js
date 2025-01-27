import { prisma } from "../../../../prisma/prisma";
import { PostgresDeleteUserRepository } from "./delete-user";
import { user } from "../../../tests";

describe("DeleteUserRepository", () => {
    it("should delete user on db", async () => {
        await prisma.user.create({ data: user });

        // Arrange
        const sut = new PostgresDeleteUserRepository();

        // Act
        const result = await sut.execute(user.id);

        // Assert
        expect(result).toStrictEqual(user);
    });
});

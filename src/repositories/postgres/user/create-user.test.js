import { PostgresCreateUserRepository } from "./create-user";
import { user } from "../../../tests";
import { prisma } from "../../../../prisma/prisma";

describe("CreateUserRepository", () => {
    it("should create a user on db", async () => {
        // Arrange
        const sut = new PostgresCreateUserRepository();

        // Act
        const result = await sut.execute(user);

        // Assert
        expect(result).toEqual(user);
    });

    it("should call Prisma with correct values", async () => {
        // Arrange
        const sut = new PostgresCreateUserRepository();
        const prismaSpy = jest.spyOn(prisma.user, "create");

        // Act
        await sut.execute(user);

        // Assert
        expect(prismaSpy).toHaveBeenCalledWith({
            data: user,
        });
    });
});

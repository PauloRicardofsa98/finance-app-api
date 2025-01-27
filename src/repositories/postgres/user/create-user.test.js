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

    it("should throw if Prisma throws", async () => {
        // Arrange
        const sut = new PostgresCreateUserRepository();
        jest.spyOn(prisma.user, "create").mockRejectedValueOnce(new Error());

        // Act
        const promise = sut.execute(user);

        // Assert
        await expect(promise).rejects.toThrow();
    });
});

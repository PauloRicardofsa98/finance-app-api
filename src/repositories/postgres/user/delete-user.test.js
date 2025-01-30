import { prisma } from "../../../../prisma/prisma";
import { PostgresDeleteUserRepository } from "./delete-user";
import { user } from "../../../tests";
import { UserNotFoundError } from "../../../errors";

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

    it("should call prisma with correct params", async () => {
        await prisma.user.create({ data: user });

        // Arrange
        const sut = new PostgresDeleteUserRepository();
        const spy = jest.spyOn(prisma.user, "delete");

        // Act
        await sut.execute(user.id);

        // Assert
        expect(spy).toHaveBeenCalledWith({
            where: { id: user.id },
        });
    });

    it("should throw if prisma throws", async () => {
        // Arrange
        const sut = new PostgresDeleteUserRepository();
        jest.spyOn(prisma.user, "delete").mockRejectedValueOnce(new Error());

        // Act
        const promise = sut.execute(user.id);

        // Assert
        await expect(promise).rejects.toThrow();
    });

    it("should throw UserNotFoundError if user does not exist", async () => {
        // Arrange
        const sut = new PostgresDeleteUserRepository();
        jest.spyOn(prisma.user, "delete").mockRejectedValueOnce(
            new UserNotFoundError()
        );

        // Act
        const promise = sut.execute(user.id);

        // Assert
        await expect(promise).rejects.toThrow(new UserNotFoundError());
    });
});

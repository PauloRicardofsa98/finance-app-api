import { PostgresGetUserByEmailRepository } from "./get-user-by-email";
import { user as fakeUser } from "../../../tests";
import { prisma } from "../../../../prisma/prisma";

describe("GetUserByEmailRepository", () => {
    it("should return a user", async () => {
        const user = await prisma.user.create({ data: fakeUser });

        // Arrange
        const sut = new PostgresGetUserByEmailRepository();

        // Act
        const result = await sut.execute(user.email);

        // Assert
        expect(result).toStrictEqual(user);
    });

    it("should call Prisma with correct values", async () => {
        // Arrange
        const sut = new PostgresGetUserByEmailRepository();
        const prismaSpy = jest.spyOn(prisma.user, "findUnique");

        // Act
        await sut.execute(fakeUser.email);

        // Assert
        expect(prismaSpy).toHaveBeenCalledWith({
            where: { email: fakeUser.email },
        });
    });

    it("should throw if Prisma throws", async () => {
        // Arrange
        const sut = new PostgresGetUserByEmailRepository();
        jest.spyOn(prisma.user, "findUnique").mockRejectedValue(new Error());

        // Act
        const promise = sut.execute(fakeUser.email);

        // Assert
        await expect(promise).rejects.toThrow();
    });
});

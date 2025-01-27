import { prisma } from "../../../../prisma/prisma";
import { PostgresGetUserByIdRepository } from "./get-user-by-id";
import { user as fakeUser } from "../../../tests";

describe("GetUserByIdRepository", () => {
    it("should return a user", async () => {
        const user = await prisma.user.create({ data: fakeUser });

        // Arrange
        const sut = new PostgresGetUserByIdRepository();

        // Act
        const result = await sut.execute(user.id);

        // Assert
        expect(result).toStrictEqual(user);
    });

    it("should call Prisma with correct values", async () => {
        // Arrange
        const sut = new PostgresGetUserByIdRepository();
        const prismaSpy = jest.spyOn(prisma.user, "findUnique");

        // Act
        await sut.execute(fakeUser.id);

        // Assert
        expect(prismaSpy).toHaveBeenCalledWith({
            where: { id: fakeUser.id },
        });
    });

    it("should throw if Prisma throws", async () => {
        // Arrange
        const sut = new PostgresGetUserByIdRepository();
        jest.spyOn(prisma.user, "findUnique").mockRejectedValue(new Error());

        // Act
        const promise = sut.execute(fakeUser.id);

        // Assert
        await expect(promise).rejects.toThrow();
    });
});

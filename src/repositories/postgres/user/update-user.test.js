import { prisma } from "../../../../prisma/prisma";
import { PostgresUpdateUserRepository } from "./update-user";
import { user as fakeUser } from "../../../tests";

describe("UpdateUserRepository", () => {
    it("should update a user", async () => {
        // Arrange
        const user = await prisma.user.create({ data: fakeUser });
        const sut = new PostgresUpdateUserRepository();

        // Act
        const result = await sut.execute(user.id, {
            first_name: "new name",
        });

        // Assert
        expect(result).toStrictEqual({ ...user, first_name: "new name" });
    });

    it("should call Prisma with correct values", async () => {
        const user = await prisma.user.create({ data: fakeUser });
        // Arrange
        const sut = new PostgresUpdateUserRepository();
        const prismaSpy = jest.spyOn(prisma.user, "update");

        // Act
        await sut.execute(user.id, { first_name: "new name" });

        // Assert
        expect(prismaSpy).toHaveBeenCalledWith({
            where: { id: user.id },
            data: { first_name: "new name" },
        });
    });

    it("should throw if Prisma throws", async () => {
        // Arrange
        const sut = new PostgresUpdateUserRepository();
        jest.spyOn(prisma.user, "update").mockRejectedValue(new Error());

        // Act
        const promise = sut.execute(fakeUser.id, { first_name: "new name" });

        // Assert
        await expect(promise).rejects.toThrow();
    });
});

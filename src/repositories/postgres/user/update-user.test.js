import { prisma } from "../../../../prisma/prisma";
import { PostgresUpdateUserRepository } from "./update-user";
import { user as fakeUser } from "../../../tests";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { UserNotFoundError } from "../../../errors";
import { faker } from "@faker-js/faker";

describe("UpdateUserRepository", () => {
    it("should update a user", async () => {
        // Arrange
        const user = await prisma.user.create({ data: fakeUser });
        const sut = new PostgresUpdateUserRepository();

        // Act
        const result = await sut.execute(user.id, {
            firstName: "new name",
        });

        // Assert
        expect(result).toStrictEqual({ ...user, firstName: "new name" });
    });

    it("should call Prisma with correct values", async () => {
        const user = await prisma.user.create({ data: fakeUser });
        // Arrange
        const sut = new PostgresUpdateUserRepository();
        const prismaSpy = import.meta.jest.spyOn(prisma.user, "update");

        // Act
        await sut.execute(user.id, { firstName: "new name" });

        // Assert
        expect(prismaSpy).toHaveBeenCalledWith({
            where: { id: user.id },
            data: { firstName: "new name" },
        });
    });

    it("should throw if Prisma throws", async () => {
        // Arrange
        const sut = new PostgresUpdateUserRepository();
        import.meta.jest
            .spyOn(prisma.user, "update")
            .mockRejectedValue(new Error());

        // Act
        const promise = sut.execute(fakeUser.id, { firstName: "new name" });

        // Assert
        await expect(promise).rejects.toThrow();
    });

    it("should throw UserNotFoundError if user does not exist to update", async () => {
        // Arrange
        const sut = new PostgresUpdateUserRepository();
        import.meta.jest.spyOn(prisma.user, "update").mockRejectedValueOnce(
            new PrismaClientKnownRequestError("", {
                code: "P2025",
            }),
        );

        const userId = faker.string.uuid();
        // Act
        const promise = sut.execute(userId, {
            firstName: "new name",
        });

        // Assert
        await expect(promise).rejects.toThrow(new UserNotFoundError(userId));
    });
});

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
});

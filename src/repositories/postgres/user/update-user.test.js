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
});

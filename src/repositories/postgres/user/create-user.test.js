import { PostgresCreateUserRepository } from "./create-user";
import { user } from "../../../tests";

describe("CreateUserRepository", () => {
    it("should create a user on db", async () => {
        // Arrange
        const sut = new PostgresCreateUserRepository();

        // Act
        const result = await sut.execute(user);

        // Assert
        expect(result).not.toBeNull();
    });
});

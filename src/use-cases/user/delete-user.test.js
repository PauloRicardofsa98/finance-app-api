import { DeleteUserUseCase } from "./delete-user";
import { faker } from "@faker-js/faker";
import { user } from "../../tests";

describe("DeleteUserUseCase", () => {
    class DeleteUserRepositoryStub {
        async execute() {
            return user;
        }
    }

    const makeSut = () => {
        const deleteUserRepository = new DeleteUserRepositoryStub();
        const sut = new DeleteUserUseCase(deleteUserRepository);
        return {
            sut,
            deleteUserRepository,
        };
    };

    it("should successfully delete a user", async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const response = await sut.execute(faker.string.uuid());

        // Assert
        expect(response).toBeTruthy();
        expect(response).toEqual(user);
    });

    it("should call DeleteUserRepository with correct values", async () => {
        // Arrange
        const { sut, deleteUserRepository } = makeSut();
        const deleteUserRepositorySpy = jest.spyOn(
            deleteUserRepository,
            "execute",
        );
        const uuid = faker.string.uuid();

        // Act
        await sut.execute(uuid);

        // Assert
        expect(deleteUserRepositorySpy).toHaveBeenCalledWith(uuid);
    });

    it("should throw an error if DeleteUserRepository throws", async () => {
        // Arrange
        const { sut, deleteUserRepository } = makeSut();
        jest.spyOn(deleteUserRepository, "execute").mockRejectedValueOnce(
            new Error(),
        );

        // Act
        const promise = sut.execute(faker.string.uuid());

        // Assert
        await expect(promise).rejects.toThrow(new Error());
    });
});

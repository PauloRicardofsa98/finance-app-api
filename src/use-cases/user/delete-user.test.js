import { DeleteUserUseCase } from "./delete-user";
import { faker } from "@faker-js/faker";

describe("DeleteUserUseCase", () => {
    const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    };

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
            "execute"
        );
        const uuid = faker.string.uuid();

        // Act
        await sut.execute(uuid);

        // Assert
        expect(deleteUserRepositorySpy).toHaveBeenCalledWith(uuid);
    });
});

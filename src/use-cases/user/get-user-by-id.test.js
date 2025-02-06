import { faker } from "@faker-js/faker";
import { GetUserByIdUseCase } from "./get-user-by-id";
import { user } from "../../tests";

describe("GetUserById UseCase", () => {
    class GetUserByIdRepositoryStub {
        async execute() {
            return user;
        }
    }

    const makeSut = () => {
        const getUserByIdRepository = new GetUserByIdRepositoryStub();
        const sut = new GetUserByIdUseCase(getUserByIdRepository);
        return {
            sut,
            getUserByIdRepository,
        };
    };

    it("should successfully get a user by id", async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const response = await sut.execute(faker.string.uuid());

        // Assert
        expect(response).toBeTruthy();
        expect(response).toEqual(user);
    });

    it("should call GetUserByIdRepository with correct values", async () => {
        // Arrange
        const { sut, getUserByIdRepository } = makeSut();
        const getUserByIdRepositorySpy = jest.spyOn(
            getUserByIdRepository,
            "execute",
        );
        const uuid = faker.string.uuid();

        // Act
        await sut.execute(uuid);

        // Assert
        expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(uuid);
    });

    it("should throw an error if GetUserByIdRepository throws", async () => {
        // Arrange
        const { sut, getUserByIdRepository } = makeSut();
        jest.spyOn(getUserByIdRepository, "execute").mockRejectedValueOnce(
            new Error(),
        );

        // Act
        const promise = sut.execute(faker.string.uuid());

        // Assert
        await expect(promise).rejects.toThrow();
    });
});

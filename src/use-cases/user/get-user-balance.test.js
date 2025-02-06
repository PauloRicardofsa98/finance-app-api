import { faker } from "@faker-js/faker";
import { GetUserBalanceUseCase } from "./get-user-balance";
import { UserNotFoundError } from "../../errors/user";
import { userBalance, user } from "../../tests";

describe("GetUserBalance UseCase", () => {
    class GetUserBalanceRepositoryStub {
        async execute() {
            return userBalance;
        }
    }

    class getUserByIdRepositoryStub {
        async execute() {
            return user;
        }
    }

    const makeSut = () => {
        const getUserBalanceRepository = new GetUserBalanceRepositoryStub();
        const getUserByIdRepository = new getUserByIdRepositoryStub();
        const sut = new GetUserBalanceUseCase(
            getUserBalanceRepository,
            getUserByIdRepository,
        );
        return {
            sut,
            getUserBalanceRepository,
            getUserByIdRepository,
        };
    };

    it("should successfully get user balance", async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const response = await sut.execute(faker.string.uuid());

        // Assert
        expect(response).toBeTruthy();
        expect(response).toEqual(userBalance);
    });

    it("should throw UserNotFoundError when user is not found", async () => {
        // Arrange
        const { sut, getUserByIdRepository } = makeSut();
        getUserByIdRepository.execute = import.meta.jest
            .fn()
            .mockResolvedValue(null);
        const uuid = faker.string.uuid();
        // Act
        const promise = sut.execute(uuid);

        // Assert
        await expect(promise).rejects.toThrow(new UserNotFoundError(uuid));
    });

    it("should call GetUserByIdRepository with correct values", async () => {
        // Arrange
        const { sut, getUserByIdRepository } = makeSut();
        const getUserByIdRepositorySpy = import.meta.jest.spyOn(
            getUserByIdRepository,
            "execute",
        );
        const uuid = faker.string.uuid();

        // Act
        await sut.execute(uuid);

        // Assert
        expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(uuid);
    });

    it("should call GetUserBalanceRepository with correct values", async () => {
        // Arrange
        const { sut, getUserBalanceRepository } = makeSut();
        const getUserBalanceRepositorySpy = import.meta.jest.spyOn(
            getUserBalanceRepository,
            "execute",
        );
        const uuid = faker.string.uuid();

        // Act
        await sut.execute(uuid);

        // Assert
        expect(getUserBalanceRepositorySpy).toHaveBeenCalledWith(uuid);
    });

    it("should throw an error if GetUserBalanceRepository throws", async () => {
        // Arrange
        const { sut, getUserBalanceRepository } = makeSut();
        import.meta.jest
            .spyOn(getUserBalanceRepository, "execute")
            .mockRejectedValueOnce(new Error());

        // Act
        const promise = sut.execute(faker.string.uuid());

        // Assert
        await expect(promise).rejects.toThrow(new Error());
    });

    it("should throw an error if GetUserByIdRepository throws", async () => {
        // Arrange
        const { sut, getUserByIdRepository } = makeSut();
        import.meta.jest
            .spyOn(getUserByIdRepository, "execute")
            .mockRejectedValueOnce(new Error());

        // Act
        const promise = sut.execute(faker.string.uuid());

        // Assert
        await expect(promise).rejects.toThrow(new Error());
    });
});

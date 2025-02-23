import { faker } from "@faker-js/faker";
import { GetTransactionsByUserIdUseCase } from "./get-transactions-by-user-id";
import { UserNotFoundError } from "../../errors/user";
import { user } from "../../tests";

describe("GetTransactionsByUserIdUseCase", () => {
    class GetTransactionsByUserIdRepositoryStub {
        async execute() {
            return [];
        }
    }

    class GetUserByIdRepositoryStub {
        async execute(userId) {
            return { ...user, userId };
        }
    }

    const makeSut = () => {
        const getTransactionsByUserIdRepositoryStub =
            new GetTransactionsByUserIdRepositoryStub();
        const getUserByIdRepositoryStub = new GetUserByIdRepositoryStub();
        const sut = new GetTransactionsByUserIdUseCase(
            getTransactionsByUserIdRepositoryStub,
            getUserByIdRepositoryStub,
        );
        return {
            sut,
            getTransactionsByUserIdRepositoryStub,
            getUserByIdRepositoryStub,
        };
    };

    it("should get transactions by user id", async () => {
        // Arrange
        const { sut } = makeSut();
        const userId = faker.string.uuid();

        // Act
        const transactions = await sut.execute(userId);

        // Assert
        expect(transactions).toEqual([]);
    });

    it("should call GetUserByIdRepository with correct values", async () => {
        // Arrange
        const { sut, getUserByIdRepositoryStub } = makeSut();
        const executeSpy = import.meta.jest.spyOn(
            getUserByIdRepositoryStub,
            "execute",
        );
        const userId = faker.string.uuid();

        // Act
        await sut.execute(userId);

        // Assert
        expect(executeSpy).toHaveBeenCalledWith(userId);
    });

    it("should call GetTransactionsByUserIdRepository with correct values", async () => {
        // Arrange
        const { sut, getTransactionsByUserIdRepositoryStub } = makeSut();
        const executeSpy = import.meta.jest.spyOn(
            getTransactionsByUserIdRepositoryStub,
            "execute",
        );
        const userId = faker.string.uuid();
        const from = "2025-01-01";
        const to = "2025-01-31";

        // Act
        await sut.execute(userId, from, to);

        // Assert
        expect(executeSpy).toHaveBeenCalledWith(userId, from, to);
    });

    it("should throw if UserNotFoundError if user does not exist", async () => {
        // Arrange
        const { sut, getUserByIdRepositoryStub } = makeSut();
        import.meta.jest
            .spyOn(getUserByIdRepositoryStub, "execute")
            .mockResolvedValue(null);
        const userId = faker.string.uuid();

        // Act
        const promise = sut.execute(userId);

        // Assert
        await expect(promise).rejects.toThrow(new UserNotFoundError(userId));
    });

    it("should throw if GetTransactionsByUserIdRepository throws", async () => {
        // Arrange
        const { sut, getTransactionsByUserIdRepositoryStub } = makeSut();
        import.meta.jest
            .spyOn(getTransactionsByUserIdRepositoryStub, "execute")
            .mockRejectedValue(new Error());
        const userId = faker.string.uuid();

        // Act
        const promise = sut.execute(userId);

        // Assert
        await expect(promise).rejects.toThrow();
    });
});

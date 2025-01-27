import { faker } from "@faker-js/faker";
import { GetTransactionsByUserIdUseCase } from "./get-transactions-by-user-id";
import { UserNotFoundError } from "../../errors/user";

describe("GetTransactionsByUserIdUseCase", () => {
    const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    };

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
            getUserByIdRepositoryStub
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
        const executeSpy = jest.spyOn(getUserByIdRepositoryStub, "execute");
        const userId = faker.string.uuid();

        // Act
        await sut.execute(userId);

        // Assert
        expect(executeSpy).toHaveBeenCalledWith(userId);
    });

    it("should call GetTransactionsByUserIdRepository with correct values", async () => {
        // Arrange
        const { sut, getTransactionsByUserIdRepositoryStub } = makeSut();
        const executeSpy = jest.spyOn(
            getTransactionsByUserIdRepositoryStub,
            "execute"
        );
        const userId = faker.string.uuid();

        // Act
        await sut.execute(userId);

        // Assert
        expect(executeSpy).toHaveBeenCalledWith(userId);
    });

    it("should throw if UserNotFoundError if user does not exist", async () => {
        // Arrange
        const { sut, getUserByIdRepositoryStub } = makeSut();
        jest.spyOn(getUserByIdRepositoryStub, "execute").mockResolvedValue(
            null
        );
        const userId = faker.string.uuid();

        // Act
        const promise = sut.execute(userId);

        // Assert
        await expect(promise).rejects.toThrow(new UserNotFoundError(userId));
    });
});

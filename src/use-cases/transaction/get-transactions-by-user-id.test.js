import { faker } from "@faker-js/faker";
import { GetTransactionsByUserIdUseCase } from "./get-transactions-by-user-id";

describe("GetTransactionsByUserIdUseCase", () => {
    const transaction = {
        user_id: faker.string.uuid(),
        name: faker.string.alphanumeric(10),
        date: faker.date.anytime().toISOString(),
        type: "EXPENSE",
        amount: Number(faker.finance.amount()),
    };
    const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    };

    class GetTransactionsByUserIdRepositoryStub {
        async execute(userId) {
            return { ...transaction, userId };
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
        expect(transactions).toEqual({ ...transaction, userId });
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
});

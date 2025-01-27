import { CreateTransactionUseCase } from "./create-transaction";
import { faker } from "@faker-js/faker";

describe("CreateTransactionUseCase", () => {
    const createTransactionParams = {
        id: faker.string.uuid(),
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

    class CreateTransactionRepositoryStub {
        execute(transaction) {
            return transaction;
        }
    }

    class GetUserByIdRepositoryStub {
        execute(userId) {
            return { ...user, userId };
        }
    }

    class IdGeneratorAdapterStub {
        execute() {
            return "any_id";
        }
    }

    const makeSut = () => {
        const createTransactionRepositoryStub =
            new CreateTransactionRepositoryStub();
        const getUserByIdRepositoryStub = new GetUserByIdRepositoryStub();
        const idGeneratorAdapterStub = new IdGeneratorAdapterStub();
        const sut = new CreateTransactionUseCase(
            createTransactionRepositoryStub,
            getUserByIdRepositoryStub,
            idGeneratorAdapterStub
        );
        return {
            sut,
            createTransactionRepositoryStub,
            getUserByIdRepositoryStub,
            idGeneratorAdapterStub,
        };
    };

    it("should create a transaction", async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const response = await sut.execute(createTransactionParams);

        // Assert
        expect(response).toEqual({ ...createTransactionParams, id: "any_id" });
    });
});

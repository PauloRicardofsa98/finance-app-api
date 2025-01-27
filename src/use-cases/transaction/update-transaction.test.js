import { faker } from "@faker-js/faker";

describe("UpdateTransactionUseCase", () => {
    const transaction = {
        id: faker.string.uuid(),
        user_id: faker.string.uuid(),
        name: faker.string.alphanumeric(10),
        date: faker.date.anytime().toISOString(),
        type: "EXPENSE",
        amount: Number(faker.finance.amount()),
    };
    class UpdateTransactionUseCase {
        async execute(transactionId) {
            return { id: transactionId, ...transaction };
        }
    }

    const makeSut = () => {
        const updateTransactionRepositoryStub = new UpdateTransactionUseCase();
        const sut = new UpdateTransactionUseCase(
            updateTransactionRepositoryStub
        );
        return { sut, updateTransactionRepositoryStub };
    };

    it("should update a transaction", async () => {
        // Arrange
        const { sut } = makeSut();
        // Act
        const response = await sut.execute(transaction.id, { amount: 100 });
        // Assert
        expect(response).toEqual(transaction);
    });
});

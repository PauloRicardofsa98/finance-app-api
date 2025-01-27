import { faker } from "@faker-js/faker";
import { DeleteTransactionUseCase } from "./delete-transaction";

describe("DeleteTransactionUseCase", () => {
    const transaction = {
        user_id: faker.string.uuid(),
        name: faker.string.alphanumeric(10),
        date: faker.date.anytime().toISOString(),
        type: "EXPENSE",
        amount: Number(faker.finance.amount()),
    };

    class DeleteTransactionRepositoryStub {
        async execute(transactionId) {
            return {
                ...transaction,
                transactionId,
            };
        }
    }

    const makeSut = () => {
        const deleteTransactionRepositoryStub =
            new DeleteTransactionRepositoryStub();
        const sut = new DeleteTransactionUseCase(
            deleteTransactionRepositoryStub
        );
        return { sut, deleteTransactionRepositoryStub };
    };

    it("should delete a transaction", async () => {
        // Arrange
        const { sut } = makeSut();
        // Act
        const deletedTransaction = await sut.execute(transaction.id);
        // Assert
        expect(deletedTransaction).toEqual({
            ...transaction,
            transactionId: transaction.id,
        });
    });
});

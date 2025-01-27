import { faker } from "@faker-js/faker";
import { UpdateTransactionUseCase } from "./update-transaction";
import { transaction } from "../../tests";

describe("UpdateTransactionUseCase", () => {
    class UpdateTransactionRepositoryStub {
        async execute(transactionId) {
            return { id: transactionId, ...transaction };
        }
    }

    const makeSut = () => {
        const updateTransactionRepository =
            new UpdateTransactionRepositoryStub();
        const sut = new UpdateTransactionUseCase(updateTransactionRepository);
        return { sut, updateTransactionRepository };
    };

    it("should update a transaction", async () => {
        // Arrange
        const { sut } = makeSut();
        // Act
        const response = await sut.execute(transaction.id, {
            amount: faker.finance.amount(),
        });
        // Assert
        expect(response).toEqual(transaction);
    });

    it("should call updateTransactionRepository with correct params", async () => {
        // Arrange
        const { sut, updateTransactionRepository } = makeSut();
        const updateTransactionRepositorySpy = jest.spyOn(
            updateTransactionRepository,
            "execute"
        );
        // Act
        await sut.execute(transaction.id, { amount: transaction.amount });
        // Assert
        expect(updateTransactionRepositorySpy).toHaveBeenCalledWith(
            transaction.id,
            { amount: transaction.amount }
        );
    });

    it("should throw if updateTransactionRepository throws", async () => {
        // Arrange
        const { sut, updateTransactionRepository } = makeSut();
        jest.spyOn(
            updateTransactionRepository,
            "execute"
        ).mockRejectedValueOnce(new Error());
        // Act
        const promise = sut.execute(transaction.id, {
            amount: transaction.amount,
        });
        // Assert
        await expect(promise).rejects.toThrow();
    });
});

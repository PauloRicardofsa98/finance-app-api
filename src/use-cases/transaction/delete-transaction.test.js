import { faker } from "@faker-js/faker";
import { DeleteTransactionUseCase } from "./delete-transaction";
import { transaction } from "../../tests";

describe("DeleteTransactionUseCase", () => {
    const userId = faker.string.uuid();
    class DeleteTransactionRepositoryStub {
        async execute() {
            return {
                ...transaction,
                userId,
            };
        }
    }
    class GetTransactionByIdRepositoryStub {
        async execute() {
            return {
                ...transaction,
                userId,
            };
        }
    }

    const makeSut = () => {
        const deleteTransactionRepositoryStub =
            new DeleteTransactionRepositoryStub();
        const getTransactionByIdRepositoryStub =
            new GetTransactionByIdRepositoryStub();
        const sut = new DeleteTransactionUseCase(
            deleteTransactionRepositoryStub,
            getTransactionByIdRepositoryStub,
        );
        return {
            sut,
            deleteTransactionRepositoryStub,
            getTransactionByIdRepositoryStub,
        };
    };

    it("should delete a transaction", async () => {
        // Arrange
        const { sut } = makeSut();
        // Act
        const deletedTransaction = await sut.execute(transaction.id, userId);
        // Assert
        expect(deletedTransaction).toEqual({
            ...transaction,
            userId,
        });
    });

    it("should call DeleteTransactionRepository with correct values", async () => {
        // Arrange
        const { sut, deleteTransactionRepositoryStub } = makeSut();
        const executeSpy = import.meta.jest.spyOn(
            deleteTransactionRepositoryStub,
            "execute",
        );
        const id = faker.string.uuid();
        // Act
        await sut.execute(id, userId);
        // Assert
        expect(executeSpy).toHaveBeenCalledWith(id);
    });

    it("should throw if DeleteTransactionRepository throws", async () => {
        // Arrange
        const { sut, deleteTransactionRepositoryStub } = makeSut();
        import.meta.jest
            .spyOn(deleteTransactionRepositoryStub, "execute")
            .mockRejectedValueOnce(new Error());
        // Act
        const promise = sut.execute(transaction.id, userId);
        // Assert
        await expect(promise).rejects.toThrow();
    });
});

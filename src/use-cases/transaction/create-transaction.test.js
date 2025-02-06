import { CreateTransactionUseCase } from "./create-transaction";
import { UserNotFoundError } from "../../errors/user";
import { transaction, user } from "../../tests";

describe("CreateTransactionUseCase", () => {
    const createTransactionParams = { ...transaction, id: undefined };

    class CreateTransactionRepositoryStub {
        execute() {
            return transaction;
        }
    }

    class GetUserByIdRepositoryStub {
        execute() {
            return user;
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
            idGeneratorAdapterStub,
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
        expect(response).toEqual(transaction);
    });

    it("should call GetUserByIdRepository with correct userId", async () => {
        // Arrange
        const { sut, getUserByIdRepositoryStub } = makeSut();
        const executeSpy = jest.spyOn(getUserByIdRepositoryStub, "execute");

        // Act
        await sut.execute(createTransactionParams);

        // Assert
        expect(executeSpy).toHaveBeenCalledWith(
            createTransactionParams.user_id,
        );
    });

    it("should call IdGeneratorAdapter", async () => {
        // Arrange
        const { sut, idGeneratorAdapterStub } = makeSut();
        const executeSpy = jest.spyOn(idGeneratorAdapterStub, "execute");

        // Act
        await sut.execute(createTransactionParams);

        // Assert
        expect(executeSpy).toHaveBeenCalled();
    });

    it("should call CreateTransactionRepository with correct params", async () => {
        // Arrange
        const { sut, createTransactionRepositoryStub } = makeSut();
        const executeSpy = jest.spyOn(
            createTransactionRepositoryStub,
            "execute",
        );

        // Act
        await sut.execute(createTransactionParams);

        // Assert
        expect(executeSpy).toHaveBeenCalledWith({
            ...createTransactionParams,
            id: "any_id",
        });
    });

    it("should throw if GetUserByIdRepository returns null", async () => {
        // Arrange
        const { sut, getUserByIdRepositoryStub } = makeSut();
        jest.spyOn(getUserByIdRepositoryStub, "execute").mockReturnValue(null);

        // Act
        const promise = sut.execute(createTransactionParams);

        // Assert
        await expect(promise).rejects.toThrow(
            new UserNotFoundError(createTransactionParams.user_id),
        );
    });

    it("should throw if GetUserByIdRepository throws", async () => {
        // Arrange
        const { sut, getUserByIdRepositoryStub } = makeSut();
        jest.spyOn(getUserByIdRepositoryStub, "execute").mockImplementation(
            () => {
                throw new Error();
            },
        );

        // Act
        const promise = sut.execute(createTransactionParams);

        // Assert
        await expect(promise).rejects.toThrow();
    });

    it("should throw if CreateTransactionRepository throws", async () => {
        // Arrange
        const { sut, createTransactionRepositoryStub } = makeSut();
        jest.spyOn(
            createTransactionRepositoryStub,
            "execute",
        ).mockImplementation(() => {
            throw new Error();
        });

        // Act
        const promise = sut.execute(createTransactionParams);

        // Assert
        await expect(promise).rejects.toThrow();
    });

    it("should throw if IdGeneratorAdapter throws", async () => {
        // Arrange
        const { sut, idGeneratorAdapterStub } = makeSut();
        jest.spyOn(idGeneratorAdapterStub, "execute").mockImplementation(() => {
            throw new Error();
        });

        // Act
        const promise = sut.execute(createTransactionParams);

        // Assert
        await expect(promise).rejects.toThrow();
    });
});

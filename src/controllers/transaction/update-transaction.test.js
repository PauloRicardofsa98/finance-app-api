import { UpdateTransactionController } from "./update-transaction";
import { faker } from "@faker-js/faker";
import { transaction } from "../../tests";
import { TransactionNotFoundError } from "../../errors";

describe("Update Transaction Controller", () => {
    class UpdateTransactionUseCaseStub {
        async execute() {
            return transaction;
        }
    }

    const makeSut = () => {
        const updateTransactionUseCase = new UpdateTransactionUseCaseStub();
        const sut = new UpdateTransactionController(updateTransactionUseCase);
        return {
            sut,
            updateTransactionUseCase,
        };
    };

    const httpRequest = {
        params: {
            transactionId: faker.string.uuid(),
        },
        body: {
            name: faker.string.alphanumeric(10),
            date: faker.date.anytime().toISOString(),
            type: "EXPENSE",
            amount: Number(faker.finance.amount()),
        },
    };

    it("should return 200 when updating transaction successfully", async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const response = await sut.execute(httpRequest);

        //assert
        expect(response.statusCode).toBe(200);
    });

    it("should return 400 when transactionId is not valid", async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const response = await sut.execute({
            params: { transactionId: "invalid_id" },
            body: httpRequest.body,
        });

        //assert
        expect(response.statusCode).toBe(400);
    });

    it("should return 400 when amount is invalid", async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const response = await sut.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest.body,
                amount: "invalid_amount",
            },
        });

        //assert
        expect(response.statusCode).toBe(400);
    });

    it("should return 400 when type is invalid", async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const response = await sut.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest.body,
                type: "invalid_type",
            },
        });

        //assert
        expect(response.statusCode).toBe(400);
    });

    it("should return 500 when use case throws an unexpected error", async () => {
        //arrange
        const { sut, updateTransactionUseCase } = makeSut();
        import.meta.jest
            .spyOn(updateTransactionUseCase, "execute")
            .mockRejectedValueOnce(new Error());

        //act
        const response = await sut.execute(httpRequest);

        //assert
        expect(response.statusCode).toBe(500);
    });

    it("should call UpdateTransactionUseCase with correct values", async () => {
        //arrange
        const { sut, updateTransactionUseCase } = makeSut();
        const executeSpy = import.meta.jest.spyOn(
            updateTransactionUseCase,
            "execute",
        );

        //act
        await sut.execute(httpRequest);

        //assert
        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.params.transactionId,
            httpRequest.body,
        );
    });

    it("should return 404 if CreateUserUseCase throws an UserNotFoundError", async () => {
        const { sut, updateTransactionUseCase } = makeSut();

        import.meta.jest
            .spyOn(updateTransactionUseCase, "execute")
            .mockRejectedValueOnce(
                new TransactionNotFoundError(faker.string.uuid()),
            );

        const result = await sut.execute(httpRequest);

        expect(result.statusCode).toBe(404);
    });
});

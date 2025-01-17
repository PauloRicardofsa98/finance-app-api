import { DeleteTransactionController } from "./delete-transaction";
import { faker } from "@faker-js/faker";

describe("Delete Transaction Controller", () => {
    class DeleteTransactionUseCaseStub {
        async execute() {
            return {
                user_id: faker.string.uuid(),
                id: faker.string.uuid(),
                name: faker.string.alphanumeric(10),
                date: faker.date.anytime().toISOString(),
                type: "EXPENSE",
                amount: Number(faker.finance.amount()),
            };
        }
    }

    const makeSut = () => {
        const deleteTransactionUseCase = new DeleteTransactionUseCaseStub();
        const sut = new DeleteTransactionController(deleteTransactionUseCase);

        return { deleteTransactionUseCase, sut };
    };

    const httpRequest = {
        params: {
            transactionId: faker.string.uuid(),
        },
    };

    it("should return 204 when deleting a transaction successfully", async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(200);
    });

    it("should return 400 when transaction id is not valid", async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute({
            params: {
                transactionId: "invalid_id",
            },
        });

        //assert
        expect(result.statusCode).toBe(400);
    });

    it("should return 404 when transaction not found", async () => {
        //arrange
        const { sut, deleteTransactionUseCase } = makeSut();
        jest.spyOn(deleteTransactionUseCase, "execute").mockResolvedValue(null);

        //act
        const response = await sut.execute(httpRequest);

        //assert
        expect(response.statusCode).toBe(404);
    });

    it("should return 500 when deleteTransactionUseCase throws an error", async () => {
        //arrange
        const { sut, deleteTransactionUseCase } = makeSut();
        jest.spyOn(deleteTransactionUseCase, "execute").mockRejectedValue(
            new Error()
        );

        //act
        const response = await sut.execute(httpRequest);

        //assert
        expect(response.statusCode).toBe(500);
    });

    it("should call deleteTransactionUseCase with correct values", async () => {
        //arrange
        const { sut, deleteTransactionUseCase } = makeSut();
        const executeSpy = jest.spyOn(deleteTransactionUseCase, "execute");

        //act
        await sut.execute(httpRequest);

        //assert
        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.params.transactionId
        );
    });
});

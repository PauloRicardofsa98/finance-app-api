import { UpdateTransactionController } from "./update-transaction";
import { faker } from "@faker-js/faker";

describe("Update Transaction Controller", () => {
    class UpdateTransactionUseCaseStub {
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
});

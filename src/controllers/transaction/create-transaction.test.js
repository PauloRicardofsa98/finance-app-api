import { CreateTransactionController } from "./create-transaction";
import { faker } from "@faker-js/faker";

describe("Create Transaction Controller", () => {
    class CreateTransactionUseCaseStub {
        async execute(transaction) {
            transaction;
        }
    }

    const makeSut = () => {
        const createTransactionUseCase = new CreateTransactionUseCaseStub();
        const sut = new CreateTransactionController(createTransactionUseCase);

        return { createTransactionUseCase, sut };
    };

    const httpRequest = {
        body: {
            user_id: faker.string.uuid(),
            name: faker.string.alphanumeric(10),
            date: faker.date.anytime().toISOString(),
            type: "EXPENSE",
            amount: Number(faker.finance.amount()),
        },
    };

    it("should return 201 when creating a transaction successfully", async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(201);
    });

    it("should return 400 when missing user_id", async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest,
                user_id: undefined,
            },
        });

        //assert
        expect(result.statusCode).toBe(400);
    });
});

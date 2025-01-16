import { GetTransactionsByUserIdController } from "./get-transactions-by-user-id";
import { faker } from "@faker-js/faker";

describe("Get Transactions By User Id Controller", () => {
    class GetTransactionsByUserIdUseCaseStub {
        async execute() {
            return [
                {
                    user_id: faker.string.uuid(),
                    id: faker.string.uuid(),
                    name: faker.string.alphanumeric(10),
                    date: faker.date.anytime().toISOString(),
                    type: "EXPENSE",
                    amount: Number(faker.finance.amount()),
                },
            ];
        }
    }

    const makeSut = () => {
        const getTransactionsByUserIdUseCaseStub =
            new GetTransactionsByUserIdUseCaseStub();
        const sut = new GetTransactionsByUserIdController(
            getTransactionsByUserIdUseCaseStub
        );
        return {
            sut,
            getTransactionsByUserIdUseCaseStub,
        };
    };

    it("should return 200 when finding transaction by user id successfully", async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const response = await sut.execute({
            query: {
                userId: faker.string.uuid(),
            },
        });

        //assert
        expect(response.statusCode).toBe(200);
    });

    it("should return 400 when userId is not provided", async () => {
        //arrange
        const { sut } = makeSut();
        const httpRequestWithoutUserId = {
            query: {},
        };

        //act
        const response = await sut.execute(httpRequestWithoutUserId);

        //assert
        expect(response.statusCode).toBe(400);
    });

    it("should return 400 when userId is invalid", async () => {
        //arrange
        const { sut } = makeSut();
        const httpRequestWithInvalidUserId = {
            query: {
                userId: "invalid_id",
            },
        };

        //act
        const response = await sut.execute(httpRequestWithInvalidUserId);

        //assert
        expect(response.statusCode).toBe(400);
    });
});
import { faker } from "@faker-js/faker";
import { GetUserBalanceController } from "./get-user-balance.js";

describe("Get User Balance Controller", () => {
    class GetUserBalanceUseCaseStup {
        async execute() {
            return {
                earning: faker.number.int(),
                expenses: faker.number.int(),
                investments: faker.number.int(),
                balance: faker.number.int(),
            };
        }
    }

    const makeSut = () => {
        const getUserBalanceUseCaseStup = new GetUserBalanceUseCaseStup();
        const sut = new GetUserBalanceController(getUserBalanceUseCaseStup);

        return { sut, getUserBalanceUseCaseStup };
    };

    const httpRequest = {
        params: { userId: faker.string.uuid() },
    };

    it("should return 200 with getting user balance", async () => {
        //arrange
        const { sut } = makeSut();

        // act
        const response = await sut.execute(httpRequest);

        // assert
        expect(response.statusCode).toBe(200);
    });
});

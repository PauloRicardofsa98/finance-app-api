import { faker } from "@faker-js/faker";
import { GetUserBalanceController } from "./get-user-balance.js";
import { UserNotFoundError } from "../../errors/user.js";
import { userBalance } from "../../tests";

describe("Get User Balance Controller", () => {
    class GetUserBalanceUseCaseStup {
        async execute() {
            return userBalance;
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

    it("should return 400 with invalid userId", async () => {
        // arrange
        const { sut } = makeSut();

        // act
        const response = await sut.execute({
            params: { userId: "invalid_id" },
        });

        // assert
        expect(response.statusCode).toBe(400);
    });

    it("should return 404 when user not found", async () => {
        // arrange
        const { sut, getUserBalanceUseCaseStup } = makeSut();
        import.meta.jest
            .spyOn(getUserBalanceUseCaseStup, "execute")
            .mockRejectedValueOnce(
                new UserNotFoundError(httpRequest.params.userId),
            );

        // act
        const response = await sut.execute(httpRequest);

        // assert
        expect(response.statusCode).toBe(404);
    });

    it("should return 500 when GetUserBalanceUseCase throws an exception", async () => {
        // arrange
        const { sut, getUserBalanceUseCaseStup } = makeSut();
        import.meta.jest
            .spyOn(getUserBalanceUseCaseStup, "execute")
            .mockRejectedValueOnce(new Error("Error"));

        // act
        const response = await sut.execute(httpRequest);

        // assert
        expect(response.statusCode).toBe(500);
    });

    it("should call GetUserBalanceUseCase with correct values", async () => {
        // arrange
        const { sut, getUserBalanceUseCaseStup } = makeSut();
        const executeSpy = import.meta.jest.spyOn(
            getUserBalanceUseCaseStup,
            "execute",
        );

        // act
        await sut.execute(httpRequest);

        // assert
        expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId);
    });
});

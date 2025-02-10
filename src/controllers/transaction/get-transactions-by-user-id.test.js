import { GetTransactionsByUserIdController } from "./get-transactions-by-user-id";
import { faker } from "@faker-js/faker";
import { UserNotFoundError } from "../../errors/user";
import { transaction } from "../../tests";

describe("Get Transactions By User Id Controller", () => {
    const from = "2025-01-01";
    const to = "2025-01-31";

    class GetTransactionsByUserIdUseCaseStub {
        async execute() {
            return [transaction];
        }
    }

    const makeSut = () => {
        const getUserByIdUseCase = new GetTransactionsByUserIdUseCaseStub();
        const sut = new GetTransactionsByUserIdController(getUserByIdUseCase);
        return {
            sut,
            getUserByIdUseCase,
        };
    };

    it("should return 200 when finding transaction by user id successfully", async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const response = await sut.execute({
            query: {
                userId: faker.string.uuid(),
                from,
                to,
            },
        });

        //assert
        expect(response.statusCode).toBe(200);
    });

    it("should return 400 when userId is not provided", async () => {
        //arrange
        const { sut } = makeSut();
        const httpRequestWithoutUserId = {
            query: { userId: undefined, from, to },
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
                from,
                to,
            },
        };

        //act
        const response = await sut.execute(httpRequestWithInvalidUserId);

        //assert
        expect(response.statusCode).toBe(400);
    });

    it("should return 404 when user not found", async () => {
        //arrange
        const { sut, getUserByIdUseCase } = makeSut();
        import.meta.jest
            .spyOn(getUserByIdUseCase, "execute")
            .mockRejectedValueOnce(new UserNotFoundError());

        //act
        const response = await sut.execute({
            query: {
                userId: faker.string.uuid(),
                from,
                to,
            },
        });

        //assert
        expect(response.statusCode).toBe(404);
    });

    it("should return 500 when any error happens", async () => {
        //arrange
        const { sut, getUserByIdUseCase } = makeSut();
        import.meta.jest
            .spyOn(getUserByIdUseCase, "execute")
            .mockRejectedValueOnce(new Error());

        //act
        const response = await sut.execute({
            query: {
                userId: faker.string.uuid(),
                from,
                to,
            },
        });

        //assert
        expect(response.statusCode).toBe(500);
    });

    it("should call getUserByIdUseCase with correct values", async () => {
        //arrange
        const { sut, getUserByIdUseCase } = makeSut();
        const executeSpy = import.meta.jest.spyOn(
            getUserByIdUseCase,
            "execute",
        );
        const userId = faker.string.uuid();
        //act
        await sut.execute({
            query: {
                userId,
                from,
                to,
            },
        });

        //assert
        expect(executeSpy).toHaveBeenCalledWith(userId);
    });
});

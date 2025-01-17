import { CreateTransactionController } from "./create-transaction";
import { UserNotFoundError } from "../../errors/user";
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

    it("should return 201 when creating a transaction successfully (expense)", async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(201);
    });

    it("should return 201 when creating a transaction successfully (earning)", async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                type: "EARNING",
            },
        });

        //assert
        expect(result.statusCode).toBe(201);
    });

    it("should return 201 when creating a transaction successfully (investment)", async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                type: "INVESTMENT",
            },
        });

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

    it("should return 400 when missing name", async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest,
                name: undefined,
            },
        });

        //assert
        expect(result.statusCode).toBe(400);
    });

    it("should return 400 when missing date", async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest,
                date: undefined,
            },
        });

        //assert
        expect(result.statusCode).toBe(400);
    });

    it("should return 400 when missing type", async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest,
                type: undefined,
            },
        });

        //assert
        expect(result.statusCode).toBe(400);
    });

    it("should return 400 when missing amount", async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest,
                amount: undefined,
            },
        });

        //assert
        expect(result.statusCode).toBe(400);
    });

    it("should return 400 when date is invalid", async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest,
                date: "invalid_date",
            },
        });

        //assert
        expect(result.statusCode).toBe(400);
    });

    it("should return 400 when type is not EXPENSE, EARNING or INVESTMENT", async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest,
                type: "invalid_type",
            },
        });

        //assert
        expect(result.statusCode).toBe(400);
    });

    it("should return 400 when amount is a valid current", async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest,
                amount: "invalid_amount",
            },
        });

        //assert
        expect(result.statusCode).toBe(400);
    });

    it("should return 500 when CreateTransactionUseCase throws an error", async () => {
        //arrange
        const { sut, createTransactionUseCase } = makeSut();
        jest.spyOn(createTransactionUseCase, "execute").mockRejectedValueOnce(
            new Error()
        );

        //act
        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(500);
    });

    it("should call CreateTransactionUseCase with correct values", async () => {
        //arrange
        const { sut, createTransactionUseCase } = makeSut();
        const executeSpy = jest.spyOn(createTransactionUseCase, "execute");

        //act
        await sut.execute(httpRequest);

        //assert
        expect(executeSpy).toHaveBeenCalledWith(httpRequest.body);
    });

    it("should return 404 when user not found", async () => {
        //arrange
        const { sut, createTransactionUseCase } = makeSut();
        jest.spyOn(createTransactionUseCase, "execute").mockRejectedValueOnce(
            new UserNotFoundError()
        );

        //act
        const response = await sut.execute(httpRequest);

        //assert
        expect(response.statusCode).toBe(400);
    });
});
